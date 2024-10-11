import React from 'react'

const Button = ({children,active,linkTo}) => {
    return (
        <div className={`text-center text-[13px] px-6 py-3 rounded-md font-bold ${active?"bg-yellow-200 hover:scale-95 transition-all duration-200 text-black":"bg-richblack-800 hover:scale-95 transition-all duration-200"}`}>
            {children}
        </div>
    )
}

export default Button
