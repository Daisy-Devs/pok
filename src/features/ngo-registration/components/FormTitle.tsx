import React from 'react'

interface FormTitleProps {
    title:string,
    description:string
}
const FormTitle:React.FC<FormTitleProps> = ({title,description}) => {
  return (
        <div>
        <h3 className="text-2xl font-extrabold text-tertiary">{title}</h3>
        <p className="text-sm font-normal text-primaryText mt-2">{description}</p>
        </div>
  )
}

export default FormTitle