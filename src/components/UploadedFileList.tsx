import { CircleCheck, X } from "lucide-react"


const UploadedFile=({fileName}:{fileName:string}) => {
  return (
    <div className='flex h-18 md:h-8 flex-row items-center gap-2 p-2 rounded border'>
     <CircleCheck size={16} className="text-green-700 text-xs shrink-0" />
     <p className='text-sm text-primaryText truncate min-w-0'>{fileName}</p>
     <button className='text-xs '><X size={16} className="text-green-700 hover:text-red-600" /> </button>
    </div>
  )
}

const UploadedFileList = ({files}:{files:string[]|Array<{ name: string; url: string }>}) => {
    console.log("files", files);
    
  return (
    <div className='grid gap-2 grid-cols-2 md:grid-cols-5'>
        {files.length > 0 && files.map((file, index) => (
            <UploadedFile key={index} fileName={typeof file === "string" ? file : file.name} />
        ))}
    </div>
  )
}

export default UploadedFileList