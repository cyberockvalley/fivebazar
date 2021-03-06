
export default function BackgroundImage({backgroundImage, title, children }) {

    return (
        <div className="outer">
            <Image
                layout="fill"
                className="object-center object-cover pointer-events-none"
                src={backgroundImage}
                alt={title}
            />
            <div className="content">
                { children }
            </div>

            <style jsx>{`
                .outer {
                    position: relative;
                    width: 100%;
                }
                .outer img {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    right: 0;
                    bottom: 0;
                    object-fit: cover;
                    object-position: center;
                }
                .content {
                    padding-top: 5rem;
                    padding-bottom: 5rem;
                    font-weight: bold;
                    font-size: 2rem;
                    text-align: center;
                    position: relative;
                    z-index: 1;
                }
            `}</style>
        </div>
    )
}