function Button({ text, type = "button", disabled }) {
    return (
        <button className="auth-button" type={type} disabled={disabled}>
            {text}
        </button>
    )


}

export default Button;