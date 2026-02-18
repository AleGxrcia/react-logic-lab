import { describe, it, expect, vi, beforeEach } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import taskReducer, {
    addTask,
    moveTask,
    deleteTask,
    setFilter,
    createTaskAsync,
    selectTasksByColumn,
    selectFilteredTasks,
} from './taskSlice'
import TaskBoard from './TaskBoard'

// =====================================================
// PARTE 1: Tests del Slice (reducers puros)
// =====================================================
describe('taskSlice (reducers)', () => {
    let store

    beforeEach(() => {
        store = configureStore({ reducer: { tasks: taskReducer } })
    })

    it('starts with an empty task list', () => {
        const state = store.getState().tasks
        expect(state.items).toEqual([])
    })

    it('adds a task to the list', () => {
        store.dispatch(addTask({
            id: '1',
            title: 'Learn Redux',
            column: 'todo',
            priority: 'high',
        }))

        const state = store.getState().tasks
        expect(state.items).toHaveLength(1)
        expect(state.items[0].title).toBe('Learn Redux')
        expect(state.items[0].column).toBe('todo')
    })

    it('moves a task to a different column', () => {
        store.dispatch(addTask({ id: '1', title: 'Task', column: 'todo', priority: 'medium' }))
        store.dispatch(moveTask({ id: '1', column: 'in-progress' }))

        const state = store.getState().tasks
        expect(state.items[0].column).toBe('in-progress')
    })

    it('deletes a task', () => {
        store.dispatch(addTask({ id: '1', title: 'Task', column: 'todo', priority: 'low' }))
        store.dispatch(deleteTask('1'))

        const state = store.getState().tasks
        expect(state.items).toHaveLength(0)
    })

    it('sets the priority filter', () => {
        store.dispatch(setFilter('high'))
        const state = store.getState().tasks
        expect(state.filter).toBe('high')
    })
})

// =====================================================
// PARTE 2: Tests de Selectores
// =====================================================
describe('taskSlice (selectors)', () => {
    const stateWith3Tasks = {
        tasks: {
            items: [
                { id: '1', title: 'Task A', column: 'todo', priority: 'high' },
                { id: '2', title: 'Task B', column: 'in-progress', priority: 'medium' },
                { id: '3', title: 'Task C', column: 'todo', priority: 'low' },
            ],
            filter: 'all',
            loading: false,
            error: null,
        }
    }

    it('selectTasksByColumn returns tasks for a specific column', () => {
        const todoTasks = selectTasksByColumn(stateWith3Tasks, 'todo')
        expect(todoTasks).toHaveLength(2)
        expect(todoTasks.map(t => t.id)).toEqual(['1', '3'])
    })

    it('selectFilteredTasks returns all tasks when filter is "all"', () => {
        const filtered = selectFilteredTasks(stateWith3Tasks)
        expect(filtered).toHaveLength(3)
    })

    it('selectFilteredTasks filters by priority', () => {
        const stateFiltered = {
            ...stateWith3Tasks,
            tasks: { ...stateWith3Tasks.tasks, filter: 'high' },
        }
        const filtered = selectFilteredTasks(stateFiltered)
        expect(filtered).toHaveLength(1)
        expect(filtered[0].priority).toBe('high')
    })
})

// =====================================================
// PARTE 3: Tests del Thunk (async)
// =====================================================
describe('taskSlice (async thunk)', () => {
    let store

    beforeEach(() => {
        store = configureStore({ reducer: { tasks: taskReducer } })
    })

    it('sets loading to true when createTaskAsync is pending', () => {
        // Dispatch a thunk that won't resolve immediately
        const promise = store.dispatch(
            createTaskAsync({ title: 'New Task', column: 'todo', priority: 'high' })
        )

        const state = store.getState().tasks
        expect(state.loading).toBe(true)
    })

    it('adds the task when createTaskAsync is fulfilled', async () => {
        // Mock fetch/api to return success
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({
                id: 'server-1',
                title: 'New Task',
                column: 'todo',
                priority: 'high',
            }),
        })

        await store.dispatch(
            createTaskAsync({ title: 'New Task', column: 'todo', priority: 'high' })
        )

        const state = store.getState().tasks
        expect(state.items).toHaveLength(1)
        expect(state.items[0].title).toBe('New Task')
        expect(state.loading).toBe(false)

        global.fetch.mockRestore()
    })

    it('sets error when createTaskAsync is rejected', async () => {
        global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

        await store.dispatch(
            createTaskAsync({ title: 'New Task', column: 'todo', priority: 'high' })
        )

        const state = store.getState().tasks
        expect(state.error).toBeTruthy()
        expect(state.loading).toBe(false)

        global.fetch.mockRestore()
    })
})

// =====================================================
// PARTE 4: Tests de Integración (Componente)
// =====================================================
describe('TaskBoard (component)', () => {
    function renderTaskBoard(preloadedState) {
        const store = configureStore({
            reducer: { tasks: taskReducer },
            preloadedState,
        })

        return render(
            <Provider store={store}>
                <TaskBoard />
            </Provider>
        )
    }

    it('renders three columns: To Do, In Progress, Done', () => {
        renderTaskBoard()
        expect(screen.getByText(/to do/i)).toBeInTheDocument()
        expect(screen.getByText(/in progress/i)).toBeInTheDocument()
        expect(screen.getByText(/done/i)).toBeInTheDocument()
    })

    it('displays tasks in their respective columns', () => {
        renderTaskBoard({
            tasks: {
                items: [
                    { id: '1', title: 'Review PR', column: 'todo', priority: 'high' },
                    { id: '2', title: 'Fix bug', column: 'in-progress', priority: 'medium' },
                ],
                filter: 'all',
                loading: false,
                error: null,
            },
        })

        expect(screen.getByText('Review PR')).toBeInTheDocument()
        expect(screen.getByText('Fix bug')).toBeInTheDocument()
    })

    it('shows a loading indicator during async operations', () => {
        renderTaskBoard({
            tasks: {
                items: [],
                filter: 'all',
                loading: true,
                error: null,
            },
        })

        expect(screen.getByTestId('loading-indicator')).toBeInTheDocument()
    })

    it('shows an error message when an operation fails', () => {
        renderTaskBoard({
            tasks: {
                items: [],
                filter: 'all',
                loading: false,
                error: 'Failed to create task',
            },
        })

        expect(screen.getByText(/failed to create task/i)).toBeInTheDocument()
    })
})
