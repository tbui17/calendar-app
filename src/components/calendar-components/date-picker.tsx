
type DatePickerProps =React.InputHTMLAttributes<HTMLInputElement> & {
    id:string
    value:string
    onBlur:React.FocusEventHandler<HTMLInputElement>
    labelName:string
    
}

export function DatePicker({id,value,onBlur,labelName,className="bg-gray-600",...otherProps}:DatePickerProps){
    return (
    <>
    <label htmlFor={id} className="pr-3">{labelName}</label>
      <input
        type="date"
        id={id}
        value={value}
        onBlur={onBlur}
		    className = {className}
        {...otherProps}
      />
      </>
    )
}