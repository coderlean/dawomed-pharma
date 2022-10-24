import loaderImage from "./images/loader.gif"
import Image from 'next/image';

const Loader = () => {
    return <Image src={loaderImage} width="200" height="200" alt="loader" />
}

export default Loader