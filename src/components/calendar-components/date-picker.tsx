
type DatePickerProps = {
    id:string
    value:string
    onChange:React.ChangeEventHandler<HTMLInputElement>
    name:string
    
}

export function DatePicker({id,value,onChange,name}:DatePickerProps){
    return (
    <>
    <label htmlFor={id} className="pr-3">{name}</label>
      <input
        type="date"
        id={id}
        value={value}
        onChange={onChange}
		className = "bg-gray-600"
      />
      </>
    )
}