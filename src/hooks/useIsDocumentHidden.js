import { useState, useEffect } from "react"

const useIsDocumentHidden = () => {

    const [isDocumentHidden, setIsDocumentHidden] = useState(false);

    useEffect(() => {
        const handleVisibilityChange = () => setIsDocumentHidden(document.hidden);

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, [])

    return isDocumentHidden
}

export default useIsDocumentHidden