
type DatePickerProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {
    id:string
    value:string
    onChange:React.ChangeEventHandler<HTMLInputElement>
    labelName:string
    
}

export function DatePicker({id,value,onChange,labelName,className="bg-gray-600",...otherProps}:DatePickerProps){
    return (
    <>
    <label htmlFor={id} className="pr-3">{labelName}</label>
      <input
        type="date"
        id={id}
        value={value}
        onChange={onChange}
		    className = {className}
        {...otherProps}
      />
      </>
    )
}