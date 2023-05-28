

export default function BasicCard(props:{text:string}) {
  return (
<div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow  dark:bg-gray-800 dark:border-gray-700">
    <p className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{props.text}</p>
    
</div>
  )
}

