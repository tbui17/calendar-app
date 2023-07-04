
type DatePickerProps =React.InputHTMLAttributes<HTMLInputElement> & {
    id:string
    value:string
    
    labelName:string
    
}

export function DatePicker({id,value,labelName,onChange, className="bg-gray-600",...otherProps}:DatePickerProps){
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