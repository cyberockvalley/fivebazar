import React from "react";

const BodySvg = () => (
    <div className="js-gulp-svg-bundle">
        <svg
        className="h-hidden-force qa-svg-bundle"
        style={{
            position: "absolute"
        }}
        xmlns="http://www.w3.org/2000/svg"
        xlink="http://www.w3.org/1999/xlink"
        >
            <defs>
                <clipPath id="clip0">
                {" "}
                <rect width={63} height={53} fill="white" />{" "}
                </clipPath>
                <clipPath id="clip1">
                {" "}
                <rect width={431} height={424} fill="white" />{" "}
                </clipPath>
                <clipPath id="clip2">
                {" "}
                <rect width={431} height={424} fill="white" />{" "}
                </clipPath>
                <clipPath id="clip3">
                {" "}
                <rect width={431} height={424} fill="white" />{" "}
                </clipPath>
                <clipPath id="clip4">
                {" "}
                <rect width={431} height={424} fill="white" />{" "}
                </clipPath>
                <clipPath id="clip5">
                {" "}
                <rect width={431} height={424} fill="white" />{" "}
                </clipPath>
                <path id="negative-a" d="M.795.345H32.19v33.347H.795z" />{" "}
                <mask id="negative-b" fill="#fff">
                {" "}
                <use xlinkHref="#negative-a" />{" "}
                </mask>
                <path id="neutral-a" d="M.795.345H32.19v33.347H.795z" />{" "}
                <mask id="neutral-b" fill="#fff">
                {" "}
                <use xlinkHref="#neutral-a" />{" "}
                </mask>
                <path id="positive-a" d="M.795.345H32.19v33.347H.795z" />{" "}
                <mask id="positive-b" fill="#fff">
                {" "}
                <use xlinkHref="#positive-a" />{" "}
                </mask>
                <path
                id="b"
                d="M71 6C54.12 6 40.265 17.335 39.194 31.612 23.118 32.397 8 43.687 8 58.957c0 6.38 2.593 12.564 7.313 17.463.933 3.75-.2 7.723-3.014 10.463a1.792 1.792 0 0 0-.406 1.99c.29.682.973 1.127 1.732 1.127 5.347 0 10.5-2.042 14.33-5.64 3.73 1.237 8.597 1.988 13.045 1.988 16.878 0 30.731-11.332 31.805-25.606 3.926-.17 8.01-.876 11.24-1.948 3.83 3.599 8.983 5.64 14.33 5.64.759 0 1.442-.444 1.732-1.126.29-.683.13-1.468-.406-1.99-2.814-2.74-3.947-6.714-3.013-10.463 4.72-4.9 7.312-11.082 7.312-17.464C104 17.525 87.718 6 71 6z"
                />{" "}
                <filter
                id="a"
                width="121.9%"
                height="125%"
                x="-9.9%"
                y="-10.1%"
                filterUnits="objectBoundingBox"
                >
                {" "}
                <feMorphology
                    in="SourceAlpha"
                    operator="dilate"
                    radius="3.5"
                    result="shadowSpreadOuter1"
                />{" "}
                <feOffset
                    dx={1}
                    dy={2}
                    in="shadowSpreadOuter1"
                    result="shadowOffsetOuter1"
                />{" "}
                <feGaussianBlur
                    in="shadowOffsetOuter1"
                    result="shadowBlurOuter1"
                    stdDeviation={2}
                />{" "}
                <feComposite
                    in="shadowBlurOuter1"
                    in2="SourceAlpha"
                    operator="out"
                    result="shadowBlurOuter1"
                />{" "}
                <feColorMatrix
                    in="shadowBlurOuter1"
                    values="0 0 0 0 0.368627451 0 0 0 0 0.443137255 0 0 0 0 0.525490196 0 0 0 0.3 0"
                />{" "}
                </filter>
                <clipPath id="clip0">
                {" "}
                <rect
                    width="28.75"
                    height={25}
                    fill="white"
                    transform="translate(5 7.5)"
                />{" "}
                </clipPath>
                <clipPath id="clip0">
                {" "}
                <rect
                    width={27}
                    height={23}
                    fill="white"
                    transform="translate(7 9)"
                />{" "}
                </clipPath>
            </defs>
            <symbol id="light-bulb" viewBox="0 0 16 22">
                {" "}
                <path
                fill="#72B747"
                fillRule="nonzero"
                d="M10.613 19.225v.643c0 .511-.391.937-.9 1.01l-.166.583a.753.753 0 0 1-.731.539H7.179a.753.753 0 0 1-.73-.539l-.161-.584c-.514-.077-.906-.498-.906-1.014v-.642c0-.344.288-.62.646-.62h3.939c.358.004.646.28.646.624zm3.033-8.664a5.281 5.281 0 0 1-1.585 3.762 4.896 4.896 0 0 0-1.386 2.698c-.071.434-.463.756-.925.756H6.245c-.457 0-.853-.317-.92-.752a4.95 4.95 0 0 0-1.396-2.707 5.286 5.286 0 0 1-1.575-3.698C2.32 7.605 4.82 5.165 7.962 5.142c3.137-.022 5.684 2.413 5.684 5.419zm-5.01-3.282A.625.625 0 0 0 8 6.668c-2.245 0-4.075 1.752-4.075 3.911 0 .335.283.611.636.611.35 0 .637-.271.637-.611C5.198 9.094 6.458 7.89 8 7.89a.622.622 0 0 0 .637-.611zM8 3.363c.35 0 .637-.271.637-.61V.61A.625.625 0 0 0 8 0a.622.622 0 0 0-.637.611v2.141c0 .34.288.611.637.611zm5.75 2.286a.65.65 0 0 0 .448-.176l1.58-1.517a.592.592 0 0 0 0-.864.654.654 0 0 0-.9 0l-1.58 1.516a.592.592 0 0 0 0 .865.661.661 0 0 0 .452.176zM1.802 5.47a.65.65 0 0 0 .448.176.65.65 0 0 0 .448-.177.592.592 0 0 0 0-.864l-1.58-1.517a.654.654 0 0 0-.901 0 .592.592 0 0 0 0 .865l1.585 1.516z"
                />{" "}
            </symbol>
        </svg>
    </div>
)

export default BodySvg