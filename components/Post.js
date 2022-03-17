import {
  BookmarkIcon,
  ChatIcon,
  DotsHorizontalIcon,
  EmojiHappyIcon,
  HeartIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/outline'
import {
  HeartIcon as HeartIconFilled,
  BookmarkIcon as BookmarkIconFilled,
} from '@heroicons/react/solid'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import {
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
  collection,
  onSnapshot,
  query,
  orderBy,
  setDoc,
  deleteDoc,
} from 'firebase/firestore'
import { db } from '../firebase'
import Moment from 'react-moment'

export default function Post({ id, username, userImg, img, caption }) {
  const { data: session } = useSession()
  const [comment, setComment] = useState()
  const [comments, setComments] = useState([])
  const [likes, setLikes] = useState([])
  const [hasLiked, setHasLiked] = useState([])

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, 'posts', id, 'comments'),
          orderBy('timestamp', 'desc')
        ),
        (snapshot) => {
          setComments(snapshot.docs)
        }
      ),
    [db]
  )

  useEffect(
    () =>
      onSnapshot(collection(db, 'posts', id, 'likes'), (snapshot) => {
        setLikes(snapshot.docs)
      }),
    [db, id]
  )

  useEffect(
    () =>
      setHasLiked(
        likes.findIndex((like) => like.id === session?.user.uid) !== -1
      ),
    [likes]
  )

  const likePost = async () => {
    if (hasLiked) {
      await deleteDoc(doc(db, 'posts', id, 'likes', session.user.uid))
    } else {
      await setDoc(doc(db, 'posts', id, 'likes', session.user.uid), {
        username: session.user.username,
      })
    }
  }

  const sendComment = async (e) => {
    e.preventDefault()

    const commentToSend = comment
    setComment('')

    await addDoc(collection(db, 'posts', id, 'comments'), {
      comment: commentToSend,
      username: session.user.username,
      userImage: session.user.image,
      timestamp: serverTimestamp(),
    })
  }

  console.log(hasLiked)

  return (
    <div className="my-7 rounded-sm border bg-white">
      {/* Header */}
      <div className=" flex items-center p-5">
        <img
          src={userImg}
          alt=""
          className="mr-3 h-12 w-12 rounded-full border object-contain p-1"
        />
        <p className="flex-1 font-bold">{username}</p>
        <DotsHorizontalIcon className="h-5" />
      </div>

      {/* Image */}
      <img src={img} alt="" className="w-full object-cover" />

      {session && (
        <>
          {/* Buttons */}
          <div className="flex justify-between px-4 pt-4">
            <div className="flex space-x-4">
              {hasLiked ? (
                <HeartIconFilled
                  onClick={likePost}
                  className="btn text-red-500"
                />
              ) : (
                <HeartIcon onClick={likePost} className="btn" />
              )}

              <ChatIcon className="btn" />
              <PaperAirplaneIcon className="btn" />
            </div>
            <BookmarkIcon className="btn" />
          </div>
        </>
      )}

      {/* Caption */}
      <p className="truncate p-5">
        {likes.length > 0 && (
          <p className="mb-1 font-bold">
            {likes.length} {likes.length > 1 ? 'likes' : 'like'}
          </p>
        )}
        <span className="mr-1 font-bold">{username} </span>
        {caption}
      </p>

      {/* Comments */}
      {comments.length > 0 && (
        <div className="ml-10 h-20 overflow-y-scroll scrollbar-thin scrollbar-thumb-black scrollbar-track-gray-400">
          {comments.map((comment) => (
            <div key={comment.id} className="mb-3 flex items-center space-x-2">
              <img
                src={comment.data().userImage}
                alt=""
                className="h-7 rounded-full"
              />
              <p className="flex-1 text-sm">
                <span className="mr-2 font-bold">
                  {comment.data().username}
                </span>
                {comment.data().comment}
              </p>
              <Moment fromNow className="pr-5 text-xs">
                {comment.data().timestamp?.toDate()}
              </Moment>
            </div>
          ))}
        </div>
      )}

      {session && (
        <>
          {/* InputBox */}
          <form className="flex items-center p-4">
            <EmojiHappyIcon className="h-7" />
            <input
              type="text"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="flex-1 border-none outline-none focus:ring-0"
            />
            <button
              type="submit"
              disabled={comment ? !comment.trim() : !comment}
              className="font-semibold text-blue-400"
              onClick={sendComment}
            >
              Post
            </button>
          </form>
        </>
      )}
    </div>
  )
}
