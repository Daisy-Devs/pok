import { CircleCheck, X } from "lucide-react"
import { UploadDocumentType } from "../constants/types";
import { useDeleteDocumentMutation } from "../store/services/api/documentApi";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import { Button } from "./ui/button";

interface UploadedFileProps {
  fileName: string,
  public_id: string,
  type: string,
  onDelete: () => void
}
const UploadedFile=({fileName,public_id,type,onDelete}:UploadedFileProps) => {
  const [deleteDocument,{isLoading}]=useDeleteDocumentMutation()
  const handleDelete = async () => {
    try {
      console.log({public_id,type});
      const res=await deleteDocument({public_id,type}).unwrap()
      console.log(res);
      onDelete()
    } catch (error) {
      toast.error("Failed to delete document")
      console.error("Error deleting document:", error);
    }
  }  
  return (
    <div className='flex h-18 md:h-8 flex-row items-center gap-2 p-2 rounded border'>
     <CircleCheck size={16} className="text-green-700 text-xs shrink-0" />
     <p className='text-sm text-primaryText truncate min-w-0'>{fileName}</p>
     <Button variant={'ghost'} className='text-xs p-0' disabled={isLoading} onClick={handleDelete} leftIcon={isLoading?<Spinner/>:<X size={16} className="text-green-700 hover:text-red-600" />}/>
    </div>
  )
}

const UploadedFileList = ({files,handleRemoveFile}:{files:Array<UploadDocumentType>,handleRemoveFile:(file:UploadDocumentType) => void} ) => {
    console.log("files", files);
  return (
    <div className='grid gap-2 grid-cols-2 md:grid-cols-5'>
        {files.length > 0 && files.map((file, index) => (
            <UploadedFile key={index} fileName={file.name} public_id={file.public_id} type={file.type} onDelete={()=>{ handleRemoveFile(file)}}/>
        ))}
    </div>
  )
}

export default UploadedFileList