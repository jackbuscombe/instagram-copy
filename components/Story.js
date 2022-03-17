export default function Story({ img, username }) {
  return (
    <div className="transform transition duration-200 ease-out hover:scale-110">
      <img
        src={img}
        alt=""
        className="h-14 w-14 cursor-pointer rounded-full border-2 border-red-500 object-contain p-[1.5px]"
      />
      <p className="w-14 truncate text-center text-xs">{username}</p>
    </div>
  )
}
