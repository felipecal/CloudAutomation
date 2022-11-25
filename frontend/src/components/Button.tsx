interface ButtonProps {
    children?: React.ReactNode;
    type?: 'button' | 'submit' | 'reset';
    onClick?: () => void;
}

export default function Button(props: ButtonProps) {
    
    return (<button id="submitBtn" type={props.type} onClick={props.onClick}>{props.children}</button>
    );
}
