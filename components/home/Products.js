import useTranslation from 'next-translate/useTranslation'
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"

import styles from '../../styles/Masonry.module.css'
import { DB_PHOTOS_SEPERATOR, MAX_RATING_STARS, NO_PROFILE_PIC, NO_USERLINK_ID_PREFIX, PROFILE_PHOTO_SIZE_XS, USERLINK_PREFIX } from '../../utils/constants'
import { buildProductLink, currencyCodeToSymbol, destroyProductLink, formatMoney, imageUrlToDimension, isClient, userLink } from '../../utils/functions'
import TextView from '../../views/TextView'
import StarRatings from 'react-star-ratings'
import Link from '../../views/link'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

import { apiPostJson } from '../../api/client'
import EmptyView from '../EmptyView'
import LoadingBalls from '../animations/LoadingBalls'
import LoadingView from '../LoadingView'
import ImageView from '../../views/ImageView'

const PRODUCT_IMAGE_MAX_WIDTH = 600
const PRODUCT_IMAGE_MAX_HEIGHT = 600
const Product = ({ product, viewer }) => {
    const { t, lang } = useTranslation('common')
    const photo = product?.photos?.split(DB_PHOTOS_SEPERATOR)[0]
    const dimensions = imageUrlToDimension(photo, PRODUCT_IMAGE_MAX_WIDTH, PRODUCT_IMAGE_MAX_HEIGHT)
    const productLink = buildProductLink(product?.id, product?.title, product?.catTextId, product?.subcatTextId)

    const [liked, setLiked] = useState(product?.liked)

    useEffect(() => {
        setLiked(product.liked)
    }, [product.liked])

    //console.log("PROD:", dimensions, photo)

    const toggleLike = e => {
        e.preventDefault()
        if(!viewer) {
            Swal.fire({
                text: t('common:require-login-message'),
                icon: 'info',
                showCancelButton: true,
                cancelButtonText: t('common:cancel'),
                confirmButtonText: t('header:sign-in')
            })
            .then(result => {
                if(result.isConfirmed) {
                    signIn()
                }
            })

        } else {
            setLiked(!liked)
        
            //api
            apiPostJson('update-list', {product_id: product.id}, lang)
            .then(r => {}).catch(e => {})
        }
    }

    return (
        <Link dataId={product?.id} href={productLink} className={`${styles.image} to-hover`} style={{border: '1px solid rgba(0,0,0,.1)', position: 'relative'}}>
            <ImageView
                isDefaultHost
                src={photo || "/"}
                width={dimensions?.width || 0}
                height={dimensions?.height || 0}
                layout="responsive"
                alt=""
            />
            <div className="w-100 h-100 p-1 pt-5 px-0 to-show" style={{position: 'absolute', top: 0, zIndex: 4, background: 'rgba(0,0,0,.5)'}}>
                <div className="d-flex flex-column w-100 h-100 mx-0">
                    <div className="row d-flex justify-content-end mx-0 mb-2" style={{position: 'relative'}}>
                        <TextView className="col-11 white-card ofy-hidden" truncate={{length: 70}} style={{height: 55}}>
                            {product?.title}
                        </TextView>
                        <div className="d-flex justify-content-end" style={{position: 'absolute', background: 'rgba(255,255,255,.8)', zIndex: 1, bottom: 0, width: '40%', height: '50%'}}>
                            <span className="pr-3 text-secondary">...</span>
                        </div>
                    </div>
                    <div className="d-flex flex-column justify-content-between w-100 h-100">
                        <div className="d-flex justify-content-end align-items-center w-100">
                            <div className="white-card mr-5 d-flex align-items-center">
                                <StarRatings
                                    rating={parseFloat(product.avgRating || 0)}
                                    starRatedColor="#fea136"
                                    starHoverColor="#ffc996"
                                    starDimension="15px"
                                    starSpacing="1px"
                                    numberOfStars={MAX_RATING_STARS}
                                    name='rating'
                                />
                                {
                                    product.totalRatings > 0?
                                    <Link href={`/reviews/${destroyProductLink(productLink).slug}`}>
                                        ({product.totalRatings})
                                    </Link>
                                    :
                                    <div>
                                        (0)
                                    </div>
                                }
                                
                            </div>
                            <div className="white-card b">
                                {currencyCodeToSymbol(product?.currency_code || "")}{formatMoney(product?.price, lang, 2)}
                            </div>
                        </div>
                        <div className="px-1 d-flex flex-row justify-content-between align-items-center w-100">
                            <Link href={userLink(product?.sellerUsername, product?.sellerId)} className="white-card d-flex flex-row align-items-center">
                                <div className="mr-2">
                                    <ImageView isDefaultHost width={PROFILE_PHOTO_SIZE_XS} height={PROFILE_PHOTO_SIZE_XS} className="profile-image-round" src={product?.sellerImage || NO_PROFILE_PIC} />
                                </div>
                                <div className="h5 m-0">
                                    {product?.sellerName}
                                </div>
                            </Link>
                            <Link href="/" onClick={toggleLike} className={`white-card fa mr-3 color-primary fa-heart${liked? '' : '-o'} d-flex justify-content-center align-items-center`}></Link>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default function Products({loading, products, viewer}) {
    const { t } = useTranslation('common')

    if(loading) return <LoadingView />

    if(!products || !Array.isArray(products)) return null

    if(products.length == 0) return <EmptyView message={t('common:no-result')} />

    return(
        <div id="products">
            <ResponsiveMasonry columnsCountBreakPoints={{350: 1, 750: 2, 900: 3, 1200: 4}}>
                <Masonry gutter={10}>
                    {
                        products.map((product, i) => {
                            return <Product product={product} viewer={viewer} key={product.id} />
                        })
                    }
                </Masonry>
            </ResponsiveMasonry>
        </div>
    )
}