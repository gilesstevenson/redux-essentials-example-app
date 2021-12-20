import React, { useState } from 'react'
import { useDispatch} from 'react-redux'
import { postDeleted } from './postsSlice'

export const PostControls = () => {
    const [deleteCount, setDeleteCount] = useState(0);
    const onDeleteCountChanged = e => setDeleteCount(Number(e.target.value))
    const dispatch = useDispatch()

    const onDeletePosts = () => {
        let count = deleteCount ?? 1
        dispatch(postDeleted(count))
    }
    return (
        <section>
            <h2>Controls</h2>
            <form>
                <label htmlFor="deleteCount">Posts Count:</label>
                <input
                    type="text"
                    id="deleteCount"
                    name="deleteCount"
                    onChange={onDeleteCountChanged}>
                </input>
                <button type="button" onClick={onDeletePosts}>Delete Posts</button>
            </form>
        </section>
    )
}
