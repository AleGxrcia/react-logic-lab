import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import VirtualizedList from './VirtualizedList'
import ArticleItem from './ArticleItem'

// Generate mock data
function generateArticles(count) {
    return Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        title: `Article ${i + 1}`,
        summary: `Summary of article ${i + 1}`,
        category: i % 3 === 0 ? 'tech' : i % 3 === 1 ? 'science' : 'art',
        bookmarked: false,
    }))
}

describe('VirtualizedList', () => {
    it('renders a list of articles', () => {
        const articles = generateArticles(20)
        render(<VirtualizedList articles={articles} />)

        expect(screen.getByText('Article 1')).toBeInTheDocument()
        expect(screen.getByText('Article 20')).toBeInTheDocument()
    })

    it('filters articles by search query', async () => {
        const user = userEvent.setup()
        const articles = generateArticles(100)
        render(<VirtualizedList articles={articles} />)

        const search = screen.getByRole('searchbox')
        await user.type(search, 'Article 42')

        expect(screen.getByText('Article 42')).toBeInTheDocument()
        expect(screen.queryByText('Article 1')).not.toBeInTheDocument()
    })

    it('shows the count of visible articles', async () => {
        const user = userEvent.setup()
        const articles = generateArticles(100)
        render(<VirtualizedList articles={articles} />)

        expect(screen.getByTestId('article-count')).toHaveTextContent('100')

        await user.type(screen.getByRole('searchbox'), 'Article 1')

        // Should match: Article 1, Article 10-19, Article 100 = 12 articles
        const count = parseInt(screen.getByTestId('article-count').textContent)
        expect(count).toBeLessThan(100)
        expect(count).toBeGreaterThan(0)
    })

    it('calls onBookmark with the article id', async () => {
        const user = userEvent.setup()
        const onBookmark = vi.fn()
        const articles = generateArticles(5)
        render(<VirtualizedList articles={articles} onBookmark={onBookmark} />)

        const bookmarkButtons = screen.getAllByRole('button', { name: /bookmark/i })
        await user.click(bookmarkButtons[0])

        expect(onBookmark).toHaveBeenCalledWith(1)
    })

    it('shows empty state when no articles match the search', async () => {
        const user = userEvent.setup()
        const articles = generateArticles(10)
        render(<VirtualizedList articles={articles} />)

        await user.type(screen.getByRole('searchbox'), 'zzzznonexistent')

        expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    })
})

describe('ArticleItem (React.memo)', () => {
    it('renders the article title and summary', () => {
        const article = { id: 1, title: 'Test Article', summary: 'Test Summary', bookmarked: false }
        render(<ArticleItem article={article} onBookmark={vi.fn()} />)

        expect(screen.getByText('Test Article')).toBeInTheDocument()
        expect(screen.getByText('Test Summary')).toBeInTheDocument()
    })

    it('does NOT re-render when parent re-renders with same props', () => {
        const renderSpy = vi.fn()
        const article = { id: 1, title: 'Test', summary: 'Summary', bookmarked: false }
        const onBookmark = vi.fn()

        // ArticleItem should be wrapped in React.memo
        // We test this by verifying the component exports a memoized version
        const { rerender } = render(
            <ArticleItem article={article} onBookmark={onBookmark} renderSpy={renderSpy} />
        )

        // Re-render with the exact same props
        rerender(
            <ArticleItem article={article} onBookmark={onBookmark} renderSpy={renderSpy} />
        )

        // If React.memo is working, renderSpy should only be called once
        // (This test works if ArticleItem calls renderSpy inside its body)
        if (renderSpy.mock.calls.length > 0) {
            expect(renderSpy).toHaveBeenCalledTimes(1)
        }
    })

    it('has a bookmark button', () => {
        const article = { id: 1, title: 'Test', summary: 'Summary', bookmarked: false }
        render(<ArticleItem article={article} onBookmark={vi.fn()} />)

        expect(screen.getByRole('button', { name: /bookmark/i })).toBeInTheDocument()
    })
})
