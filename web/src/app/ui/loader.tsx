import { RotatingLines } from "react-loader-spinner"

const Loader  = () => {

    return (
        <div className="fixed w-full h-full top-0 left-0 flex justify-center items-center">
            <RotatingLines 
                visible={true} width="96" 
                strokeWidth="5" animationDuration="0.75"
                ariaLabel="rotating-lines-loading"
                />
        </div>
    )
}

export default Loader