
function Message({ message, type }) {

    if (!message) {
        return null;
    }

    return (
        <div
            className={`alert alert-${type} alert-dismissible fade show`}
            role="alert"
        >
            {message}
        </div>
    );
}

export default Message;
