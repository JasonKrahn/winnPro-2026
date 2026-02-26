#!/bin/bash
# Migration script: Download all external images to public/images/
# and update references in content markdown files and source code.
# Compatible with macOS bash 3.x

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
IMAGE_DIR="$PROJECT_ROOT/public/images"
CONTENT_DIR="$PROJECT_ROOT/content"
SRC_DIR="$PROJECT_ROOT/src"

mkdir -p "$IMAGE_DIR"

SUCCESS=0
FAIL=0
SKIPPED=0

echo "============================================="
echo "  IMAGE MIGRATION: UploadCare/Cloudinary → Local"
echo "============================================="
echo ""

# --- Step 1: Collect all unique URLs ---
echo "Step 1: Collecting unique image URLs..."

UC_URLS=$(grep -roh 'https://ucarecdn.com/[^ "]*' "$CONTENT_DIR" "$SRC_DIR" 2>/dev/null | sort -u)
UC_COUNT=$(echo "$UC_URLS" | grep -c 'ucarecdn' || echo 0)
echo "  Found $UC_COUNT unique UploadCare URLs"

CL_URLS=$(grep -roh 'https://res.cloudinary.com/[^ "]*' "$CONTENT_DIR" "$SRC_DIR" 2>/dev/null | sort -u || true)
CL_COUNT=$(echo "$CL_URLS" | grep -c 'cloudinary' || echo 0)
echo "  Found $CL_COUNT unique Cloudinary URLs"
echo ""

# --- Step 2: Download all images ---
echo "Step 2: Downloading images..."
echo ""

# Store URL->filename mappings in temp files
URL_MAP_FILE=$(mktemp)
trap "rm -f $URL_MAP_FILE" EXIT

echo "  --- UploadCare images ---"
while IFS= read -r url; do
    [[ -z "$url" ]] && continue
    
    # Extract UUID from URL
    uuid=$(echo "$url" | sed -n 's|https://ucarecdn.com/\([a-f0-9-]*\).*|\1|p')
    [[ -z "$uuid" ]] && continue
    
    filename="${uuid}.jpg"
    dest="$IMAGE_DIR/$filename"
    
    if [[ -f "$dest" ]]; then
        echo "  SKIP: $filename"
        SKIPPED=$((SKIPPED + 1))
    elif curl -fsSL -o "$dest" "$url" 2>/dev/null; then
        # Detect format and rename if needed
        mime=$(file --mime-type -b "$dest" 2>/dev/null || echo "unknown")
        case "$mime" in
            image/png)
                mv "$dest" "${dest%.*}.png"
                filename="${uuid}.png"
                ;;
            image/webp)
                mv "$dest" "${dest%.*}.webp"
                filename="${uuid}.webp"
                ;;
        esac
        size=$(du -h "$IMAGE_DIR/$filename" | cut -f1)
        echo "  OK: $filename ($size)"
        SUCCESS=$((SUCCESS + 1))
    else
        echo "  FAIL: $url"
        rm -f "$dest"
        FAIL=$((FAIL + 1))
    fi
    
    # Record mapping
    echo "$url|/images/$filename" >> "$URL_MAP_FILE"
done <<< "$UC_URLS"

echo ""
echo "  --- Cloudinary images ---"
while IFS= read -r url; do
    [[ -z "$url" ]] && continue
    [[ "$url" != *cloudinary* ]] && continue
    
    # Extract filename from URL (last path component)
    filename=$(basename "$url" | sed 's/\?.*//') 
    dest="$IMAGE_DIR/$filename"
    
    if [[ -f "$dest" ]]; then
        echo "  SKIP: $filename"
        SKIPPED=$((SKIPPED + 1))
    elif curl -fsSL -o "$dest" "$url" 2>/dev/null; then
        mime=$(file --mime-type -b "$dest" 2>/dev/null || echo "unknown")
        case "$mime" in
            image/png)
                if [[ "$filename" != *.png ]]; then
                    mv "$dest" "${dest%.*}.png"
                    filename="${filename%.*}.png"
                fi
                ;;
            image/webp)
                if [[ "$filename" != *.webp ]]; then
                    mv "$dest" "${dest%.*}.webp"
                    filename="${filename%.*}.webp"
                fi
                ;;
        esac
        size=$(du -h "$IMAGE_DIR/$filename" | cut -f1)
        echo "  OK: $filename ($size)"
        SUCCESS=$((SUCCESS + 1))
    else
        echo "  FAIL: $url"
        rm -f "$dest"
        FAIL=$((FAIL + 1))
    fi
    
    echo "$url|/images/$filename" >> "$URL_MAP_FILE"
done <<< "$CL_URLS"

echo ""
echo "  Downloaded: $SUCCESS | Skipped: $SKIPPED | Failed: $FAIL"
echo ""

# --- Step 3: Replace URLs in files ---
echo "Step 3: Replacing URLs in source files..."

replace_count=0

# Sort URL map by URL length descending (longest first) to avoid partial replacements
SORTED_MAP=$(sort -t'|' -k1,1 -r "$URL_MAP_FILE")

# Process markdown files
while IFS= read -r -d '' file; do
    changed=false
    while IFS='|' read -r url local_path; do
        [[ -z "$url" ]] && continue
        if grep -qF "$url" "$file" 2>/dev/null; then
            # Use perl for reliable replacement (handles special chars)
            perl -pi -e "s|\Q${url}\E|${local_path}|g" "$file"
            changed=true
            replace_count=$((replace_count + 1))
        fi
    done <<< "$SORTED_MAP"
    if $changed; then
        echo "  Updated: ${file#$PROJECT_ROOT/}"
    fi
done < <(find "$CONTENT_DIR" -name "*.md" -print0)

# Process source files
while IFS= read -r -d '' file; do
    changed=false
    while IFS='|' read -r url local_path; do
        [[ -z "$url" ]] && continue
        if grep -qF "$url" "$file" 2>/dev/null; then
            perl -pi -e "s|\Q${url}\E|${local_path}|g" "$file"
            changed=true
            replace_count=$((replace_count + 1))
        fi
    done <<< "$SORTED_MAP"
    if $changed; then
        echo "  Updated: ${file#$PROJECT_ROOT/}"
    fi
done < <(find "$SRC_DIR" \( -name "*.tsx" -o -name "*.ts" \) -print0)

echo ""
echo "  Total: $replace_count file/URL replacements"
echo ""

# --- Summary ---
echo "============================================="
echo "  MIGRATION COMPLETE"
echo "============================================="
echo "  Images dir: public/images/"
echo "  Total size: $(du -sh "$IMAGE_DIR" | cut -f1)"
echo "  Files: $(ls -1 "$IMAGE_DIR" | wc -l | tr -d ' ')"
echo ""

remaining=$(grep -rl "ucarecdn\|cloudinary" "$CONTENT_DIR" "$SRC_DIR" --include="*.md" --include="*.tsx" --include="*.ts" 2>/dev/null | grep -v 'next.config' || true)
if [[ -n "$remaining" ]]; then
    echo "  ⚠️  Remaining external refs in:"
    echo "$remaining"
else
    echo "  ✅ No remaining external image references!"
fi
