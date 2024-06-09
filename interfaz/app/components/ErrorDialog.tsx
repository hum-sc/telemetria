export default function ErrorDialog(props: { message: string, title?: string }) {
    return (
        <div className="errorDialog">
            <p className="body-medium">{props.message}</p>
        </div>
    );
}
