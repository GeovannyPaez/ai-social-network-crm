import React from 'react'
import MessageAbFooter from './MessageAbFooter'

export default function Footer() {
    return (
        <footer style={{
            position: "fixed",
            bottom: "0",
            width: "100%",
            height: "2.5rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
        }}>
            <MessageAbFooter />
        </footer>
    )
}
