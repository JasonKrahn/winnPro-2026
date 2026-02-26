import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock fs with explicit implementations
vi.mock('fs', () => ({
    default: {
        readFileSync: vi.fn(),
        readdirSync: vi.fn(),
        existsSync: vi.fn(),
    },
    readFileSync: vi.fn(),
    readdirSync: vi.fn(),
    existsSync: vi.fn(),
}))

vi.mock('gray-matter', () => ({
    default: vi.fn(),
}))

import fs from 'fs'
import matter from 'gray-matter'
import { getProjectBySlug, getAllProjects, getPageData } from './content'

const mockedReadFileSync = vi.mocked(fs.readFileSync)
const mockedReaddirSync = vi.mocked(fs.readdirSync)
const mockedExistsSync = vi.mocked(fs.existsSync)
const mockedMatter = vi.mocked(matter)

describe('content utilities', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('getProjectBySlug', () => {
        it('strips .md extension from slug', () => {
            mockedReadFileSync.mockReturnValue('---\ntitle: Test\n---\nContent')
            mockedMatter.mockReturnValue({
                data: {
                    title: 'Test Project',
                    template: 'project',
                    status: 'Published',
                    date: '2026-01-01',
                    featuredImage: '/img/test.jpg',
                    categories: [],
                    gallery: [],
                    meta: { title: 'Test', description: 'A test project' },
                },
                content: 'Project content here',
            } as any)

            const project = getProjectBySlug('my-project.md')
            expect(project.slug).toBe('my-project')
        })

        it('converts Date objects to ISO date strings', () => {
            const testDate = new Date('2026-06-15T00:00:00Z')
            mockedReadFileSync.mockReturnValue('mock')
            mockedMatter.mockReturnValue({
                data: {
                    title: 'Test',
                    date: testDate,
                    categories: [],
                    gallery: [],
                    meta: { title: 'T', description: 'D' },
                },
                content: '',
            } as any)

            const project = getProjectBySlug('test')
            expect(project.date).toBe('2026-06-15')
            expect(project.date).not.toBeInstanceOf(Date)
        })
    })

    describe('getAllProjects', () => {
        it('returns projects sorted by date descending', () => {
            mockedReaddirSync.mockReturnValue([
                'old-project.md',
                'new-project.md',
            ] as any)

            mockedReadFileSync.mockReturnValue('mock')

            let callCount = 0
            mockedMatter.mockImplementation(() => {
                callCount++
                if (callCount === 1) {
                    return {
                        data: {
                            title: 'Old Project',
                            date: '2025-01-01',
                            categories: [],
                            gallery: [],
                            meta: { title: 'O', description: 'Old' },
                        },
                        content: '',
                    } as any
                }
                return {
                    data: {
                        title: 'New Project',
                        date: '2026-06-01',
                        categories: [],
                        gallery: [],
                        meta: { title: 'N', description: 'New' },
                    },
                    content: '',
                } as any
            })

            const projects = getAllProjects()
            expect(projects).toHaveLength(2)
            expect(projects[0].title).toBe('New Project')
            expect(projects[1].title).toBe('Old Project')
        })
    })

    describe('getPageData', () => {
        it('returns null when page file does not exist', () => {
            mockedExistsSync.mockReturnValue(false)
            const result = getPageData('nonexistent')
            expect(result).toBeNull()
        })

        it('returns parsed frontmatter data when page exists', () => {
            mockedExistsSync.mockReturnValue(true)
            mockedReadFileSync.mockReturnValue('mock')
            mockedMatter.mockReturnValue({
                data: { title: 'About Us', hero: 'Welcome' },
                content: '',
            } as any)

            const result = getPageData('about')
            expect(result).toEqual({ title: 'About Us', hero: 'Welcome' })
        })
    })
})
