
function FormContainer({ title, subtitle, children }) {
    return (
        <div className="form-container">
            <h1 className="form-title">{title}</h1>
            {subtitle && <p className="form-subtitle">{subtitle}</p>}
            {children}
        </div>
    )
}

export default FormContainer;