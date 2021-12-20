import { createSlice, nanoid, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '../../api/client'

const initialState = {
    items: [],
    status: 'idle',
    error: null
}

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const response = await client.get('/fakeApi/posts')
    return response.data
})

export const addNewPost = createAsyncThunk(
    'posts/addNewPost',
    // The payload creator receives the partial `{title, content, user}` object
    async initialPost => {
        // We send the initial data to the fake API server
        const response = await client.post('/fakeApi/posts', initialPost)
        // The response includes the complete post object, including unique ID
        return response.data
    }
)

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        reactionAdded(state, action) {
            const { postId, reaction } = action.payload
            const existingPost = state.items.find(post => post.id === postId)
            if (existingPost) {
                existingPost.reactions[reaction]++
            }
        },
        postAdded: {
            reducer(state, action) {
                state.items.push(action.payload)
            },
            prepare(title, content, userId) {
                return { payload: { id: nanoid(), title, content, userId, date: new Date().toISOString(), } }
            }
        },
        postDeleted: (state, action) => {
            for (let i = 0; i < action.payload; i++) {
                state.items.pop();
            }
        },
        postUpdated: (state, action) => {
            const { id, title, content } = action.payload;
            let postIndex = state.items.findIndex(p => p.id === id)
            state.items[postIndex].title = title
            state.items[postIndex].content = content

        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchPosts.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = 'succeeded'
                // Add any fetched posts to the array
                state.items = state.items.concat(action.payload)
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            .addCase(addNewPost.fulfilled, (state, action) => {
                // We can directly add the new post object to our posts array
                state.items.push(action.payload)
            })
    }
})

export const { postAdded, postDeleted, postUpdated, reactionAdded } = postsSlice.actions

export default postsSlice.reducer

export const selectAllPosts = state => state.posts.items

export const selectPostById = (state, id) => state.posts.items.find(p => p.id === id)