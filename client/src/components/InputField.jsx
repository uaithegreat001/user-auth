function InputField
    ({ label, value, name, onChange, type, error, placeholder })
{
    return (
        <div className="input-field">
            <label htmlFor={name}> {label} </label>
            <input
                id={name}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className={error ? "input-error" : ""}
                placeholder={placeholder}
            />
            {error && <p className="error"> {error} </p>}

        </div>
    )

}
export default InputField;