import React from 'react'
import './Loading.css'

export default function Loading({ color = '#7f58af', size = 80 }) {
    const circles = [...Array(12)].map((_, index) => (
        <div
            key={index}
            style={{
                background: `${color}`,
                width: size * 0.075,
                height: size * 0.075,
            }}
        />
    ))
    return (
        <div className="mask">
            <div className="loading" style={{ height: size, width: size }}>
                {circles}
            </div>
        </div>
    )
}
