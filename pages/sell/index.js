import { signIn, useSession } from 'next-auth/client'
import useTranslation from 'next-translate/useTranslation'
import Head from 'next/head'
import LoadingView from '../../components/LoadingView'
import PageBody from '../../components/PageBody'
import { DB_PHOTOS_SEPERATOR, TITLE_SEPARATOR } from '../../utils/constants'


import InputBox from '../../views/InputBox'
import { useEffect, useRef, useState } from 'react'
import useFormRules, { formFieldSet, formFieldGet, getCharsRem } from '../../hooks/form-rules'
import { FileDrop } from 'react-file-drop'

import styles from '../../styles/SellPhotoUpload.module.css'
import { API_REQUEST_STATUS, useApiGet, apiPostFileJson } from '../../api/client'
import { extFromUrl, extToMime, isFile, isString, notSet, textEmpty } from '../../utils/functions'

import dynamic from "next/dynamic";
import Swal from 'sweetalert2'
import Overlay from '../../components/Overlay'
import ProgressBar from '../../components/animations/ProgressBar'
import { useRouter } from 'next/router'

import { HStack, Text, VStack, Box } from '@chakra-ui/react'

import 'react-phone-input-2/lib/style.css'
import Link from '../../views/link'

const OrderlyListHr = dynamic(import("../../components/upload/OderlyListHr"))


const getItemStyle = (isDragging, draggableStyle, item) => ({
    ...draggableStyle
});

const listStyle = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    overflowX: 'auto',
    padding: 10,
    width: '100%'
}
const getListStyle = (isDraggingOver, itemsLength) => (itemsLength == 0? {display: 'none'} : {
    ...listStyle,
    background: isDraggingOver ? "lightblue" : "lightgrey",
});

export default function Sell({isEdit}) {
    const { t, lang } = useTranslation('sell')
    // Fetch the user client-side
    const [ session, loading ] = useSession()

    const router = useRouter()

    //the id of the product to edit
    const { product } = router.query
    const [willViewProduct, setWillViewProduct] = useState(false)

    const formRulesKeys = useFormRules()
    const formRule = useFormRules(formRulesKeys.sell)
    
    console.log("Sell:", "Query", router.query)
    
    const initValues = {
        title: "", 
        description: "", 
        price: "", 
        cat: -1,
        subcat: -1, 
        country: -1, 
        photos: []
    }
    console.log('Sell:', 'InitValues', initValues)
    //fetch product
    const [defaultValues, defaultValuesError, defaultValuesStatus, defaulrtValuesCommit, setDefaultValues] = useApiGet('product-edit-details', lang, {
        payload: {id: isEdit && product? product : null},
        initialData: {...initValues},
        requirements: {
            requiresPayloadOr: ["id"]
        },
        responseFilter: responseData => {
            console.log("Sell:", "responseFilter", responseData)
            const {title, description, price, cat, subcat, country, photos} = responseData
            var processedPhotos = typeof photos === "string"? photos.split(DB_PHOTOS_SEPERATOR) : []
            return {
                title: title,
                description: description,
                price: price,
                cat: cat,
                subcat: subcat,
                country: country,
                photos: processedPhotos
            }
        }
    })
    
    console.log('Sell:', 'DefaultValues', defaultValues)

    //fetch country list
    const [countries, countriesError, countriesStatus] = useApiGet('countries', lang, {
        initialData: [],
        noLocale: true
    })
    //fetch category list
    const [cats, catsError, catsStatus] = useApiGet('cats', lang, {
        initialData: []
    })
    //fetch sub category list
    const [subcats, subcatsError, subcatsStatus, commitSubCatUpdate] = useApiGet('subcats', lang, {
        payload: {cat_id: null},
        initialData: [],
        requirements: {
            requiresPayloadOr: ["cat_id", "cat_text_id"]
        }
    })

    //cat state and subcats trigering
    const [cat, setCat] = useState(defaultValues?.cat)
    useEffect(() => {
        if(!isNaN(cat) && parseInt(cat) > -1) {
            commitSubCatUpdate({payload: {cat_id: cat}, path: ""})
        }
    }, [cat])
    //other form states
    const [subcat, setSubcat] = useState(defaultValues?.subcat)
    const [country, setCountry] = useState(defaultValues?.country)
    const [title, setTitle] = useState(defaultValues?.title)
    const [description, setDescription] = useState(defaultValues?.description)
    const [price, setPrice] = useState(defaultValues?.price)
    const [photos, setPhotos]  = useState(defaultValues?.photos)

    useEffect(() => {console.log("Sell:", "Query!", router.query)
        var catId = cat > -1? cat : router.query.cat
        if(catId && !isNaN(catId)) {
            catId = parseInt(catId)

        } else {console.log("Sell:", "QueryCat!", router.query)
            catId = -1
        }
        var subcatId = subcat > -1? subcat : router.query.subcat
        if(subcatId && !isNaN(subcatId)) {
            subcatId = parseInt(subcatId)

        } else {
            subcatId = -1
        }
        var countryId = country > -1? country : router.query.country
        if(countryId && !isNaN(countryId)) {
            countryId = parseInt(countryId)

        } else {
            countryId = -1
        }
        setDefaultValues({
            ...(defaultValues || initValues),
            cat: catId,
            subcat: subcatId,
            country: countryId
        })
    }, [router])

    useEffect(() => {
        setCat(defaultValues?.cat)
        setSubcat(defaultValues?.subcat)
        setCountry(defaultValues?.country)
    }, [defaultValues])

    const [photoFiles, setPhotoFiles] = useState([])

    //form errors
    const [catError, setCatError] = useState("")
    const [subcatError, setSubcatError] = useState("")
    const [countryError, setCountryError] = useState("")
    const [titleError, setTitleError] = useState("")
    const [descriptionError, setDescriptionError] = useState("")
    const [priceError, setPriceError] = useState("")
    const [photosError, setPhotosError]  = useState("")

    
    var formHasError = false
    const fieldsMap = {
        title: {
            clearError: () => {
                setTitleError("")
            },
            set: value => {
                formFieldSet(value, formRule.title, null, newValue => {
                    if(!notSet(newValue)) setTitle(newValue)
                })
            },
            get: () => {
                return formFieldGet(title, formRule.title, null, (error, valueLength, expectedLength) => {
                    if(error && error.length > 0) {
                        formHasError = true
                        setTitleError(t(error))
                    }
                })
            },
            setError: error => {
                formHasError = true
                setTitleError(t(error))
            }
        },
        description: {
            clearError: () => {
                setDescriptionError("")
            },
            set: value => {
                formFieldSet(value, formRule.description, null, newValue => {
                    if(!notSet(newValue)) setDescription(newValue)
                })
            },
            get: () => {
                return formFieldGet(description, formRule.description, null, (error, valueLength, expectedLength) => {
                    if(error && error.length > 0) {
                        formHasError = true
                        setDescriptionError(t(error))
                    }
                })
            },
            setError: error => {
                formHasError = true
                setDescriptionError(t(error))
            }
        },
        price: {
            clearError: () => {
                setPriceError("")
            },
            set: value => {
                formFieldSet(value, formRule.price, null, newValue => {
                    if(!notSet(newValue)) setPrice(newValue)
                })
            },
            get: () => {
                return formFieldGet(price, formRule.price, null, (error, valueLength, expectedLength) => {
                    if(error && error.length > 0) {
                        formHasError = true
                        setPriceError(t(error))
                    }
                })
            },
            setError: error => {
                formHasError = true
                setPriceError(t(error))
            }
        },
        cat: {
            clearError: () => {
                setCatError("")
            },
            set: value => {
                formFieldSet(value, formRule.cat, null, newValue => {
                    if(!notSet(newValue)) setCat(newValue)
                })
            },
            get: () => {
                return formFieldGet(cat, formRule.cat, null, (error, valueLength, expectedLength) => {
                    if(error && error.length > 0) {
                        formHasError = true
                        setCatError(t(error))
                    }
                })
            },
            setError: error => {
                formHasError = true
                setCatError(t(error))
            }
        },
        subcat: {
            clearError: () => {
                setSubcatError("")
            },
            set: value => {
                formFieldSet(value, formRule.subcat, null, newValue => {
                    if(!notSet(newValue)) setSubcat(newValue)
                })
            },
            get: () => {
                return formFieldGet(subcat, formRule.subcat, null, (error, valueLength, expectedLength) => {
                    if(error && error.length > 0) {
                        formHasError = true
                        setSubcatError(t(error))
                    }
                })
            },
            setError: error => {
                formHasError = true
                setSubcatError(t(error))
            }
        },
        country: {
            clearError: () => {
                setCountryError("")
            },
            set: value => {
                formFieldSet(value, formRule.country, null, newValue => {
                    if(!notSet(newValue)) setCountry(newValue)
                })
            },
            get: () => {
                return formFieldGet(country, formRule.country, null, (error, valueLength, expectedLength) => {
                    if(error && error.length > 0) {
                        formHasError = true
                        setCountryError(t(error))
                    }
                })
            },
            setError: error => {
                formHasError = true
                setCountryError(t(error))
            }
        },
        photos: {
            clearError: () => {
                setPhotosError("")
            },
            set: (value, current) => {
                var newPhotos = [...(current? current : [])]
               
                value.forEach(photo => {
                    newPhotos.push({
                        id: `${Math.random()}`,
                        url: isString(photo)? photo : URL.createObjectURL(photo),
                        file: isFile(photo)? photo : null
                    })
                })
                
                
                formFieldSet(newPhotos, formRule.photos, null, newValue => {
                    if(!notSet(newValue)) setPhotos(newValue)

                }, (item) => {
                    /**
                     * Item is an obeject describing a photo, and this callback is used to return 
                     * the mime type of the item so that the validator can check if the mime is in the list
                     * of the valid mime types provided in this field's axccepted array types
                     * a photo object will have an id, an either a File object if it is just 
                     * a new photo not yet sendt to the server,
                     * or a url string if it has been uploaded to the server.
                     * This means we either get the mime from the file object or the extension in the url
                     * 
                     * An example of an uploaded photo,
                     * {id: "0.6865762915201352", url: "/uploads/1612452860621-1ff807f3-680X680.jpeg", file: null}
                     */
                    return item?.file?.type || extToMime(extFromUrl(item?.url))
                })
            },
            get: () => {
                return formFieldGet(photos, formRule.photos, null, (error, valueLength, expectedLength) => {
                    if(error && error.length > 0) {
                        formHasError = true
                        setPhotosError(t(error))
                    }
                })
            },
            setError: error => {
                formHasError = true
                setPhotosError(t(error))
            }
        }
        
    }

    const reset = values => {
        if(values) {
            for (const [key, value] of Object.entries(fieldsMap)) {
                if(value.set && !notSet(values[key])) value.set(values[key])
            }
        }
    }

    useEffect(() => {
        reset(defaultValues)
    }, [defaultValues])

    const handleChange = e => {
        fieldsMap[e.target.name].set(e.target.value)
    }


    const [uploadStatus, setUploadStatus] = useState('busy')
    const [uploadProgress, setUploadProgress] = useState(0)
    const [showUploadProgress, setShowUploadProgress] = useState(false)

    const onSubmit = async e => {
        e.preventDefault()

        var form = {}
        for (const [key, value] of Object.entries(fieldsMap)) {
            form[key] = value.clearError()
            var cleaned = await value.get()
            if(cleaned) {
                form[key] = cleaned
                
            }
        }
        

        if(!formHasError) {
            console.log("FORM:", form)
            var formData = new FormData()

            const photoFiles = []
            const photoEditOrder = []
            var photos = []
            form?.photos?.forEach(photo => {
                if(photo.file) {
                    photoFiles.push(photo.file)
                    photoEditOrder.push("file")

                } else {
                    photoEditOrder.push("url")
                    photos.push(photo.url)

                }

            });
            var json = {...form}

            var requestKey = "product-create"
            var successMsgKey = "upload-success-message"
            if(!isEdit) {
                delete json.photos
            } else {
                json.product_id = product
                json.photos = photos
                json.photo_urls_and_files_order = photoEditOrder
                requestKey = "product-edit"
                successMsgKey = "edit-success-message"
            }
            console.log("FORM:P", json, photoEditOrder, photoFiles)

            setShowUploadProgress(true)
            
            apiPostFileJson(requestKey, photoFiles, json, lang, (p) => {
                var level = parseFloat(p.loaded / p.total * 100).toFixed(0)
                setUploadProgress(level)
            })
            .then (({data}) => {
                setShowUploadProgress(false)
                setUploadProgress(0)
                Swal.fire({
                    text: t(successMsgKey),
                    icon: 'success',
                    allowOutsideClick: false,
                    confirmButtonText: t('common:ok'),
                    cancelButtonText: t('common:ok')
                })
                .then(() => {
                    setWillViewProduct(true)
                    router.push(`${data.link}?preview=1`)

                })
            })
            .catch(({request, response, message}) => {
                setShowUploadProgress(false)
                setUploadProgress(0)
                if(response.status) {
                    if(response?.data.error) {
                        Swal.fire('', t(response.data.error), 'error')

                    } else if(response?.data.errors) {
                        //Set into states for fields to display their individial errors
                        //Swal.fire('', t(JSON.stringify(response.data.errors)), 'error')
                        for( const [key, value] of Object.entries(response.data.errors)) {
                            if(fieldsMap[key]) {
                                fieldsMap[key].setError(value)
                            }
                        }

                    } else {
                        Swal.fire('',  t('common:error-try-again'), 'error')
                    }

                } else if(request) {
                    Swal.fire('', t('common:network-error'), 'error')

                } else {
                    console.log("apiPostFileJson('products')", "message", message)
                }
                
            })
        }
        
    }

    //files start
    const [dragOver, setDragOver] = useState(false)

    const [winReady, setwinReady] = useState(false);

    useEffect(() => {
        setwinReady(true);
    }, []);

    const uploadListUpdateHandler = update => {
        setPhotos(update)
    }

    const remove = index => {
        var items = [...photos]
        items.splice(index, 1)
        setPhotos(items)
    }
    
    const onUploadListItem = (item, index, isDragging) => {
        return (
            <div className={styles['upload-item']} style={{background: `url(${item.url})`, border: !isDragging ? "2px solid #70b93f" : "2px solid grey", backgroundSize: 'cover'}}>
                <div className={styles["upload-menu"]}>
                    <i onClick={() => remove(index)} className="fa fa-close"></i>
                </div>
            </div>
        )
    }
    
    const onFileInputChange = (event) => {
        const { files } = event.target;
        processFiles(files)
    }

    const processFiles = files => {
        setDragOver(false)
        files = [...files]
        
        fieldsMap.photos.set(files, photos)

    }
    //files end
    
    
    // Server-render loading state
    if ((!session && loading) || defaultValuesStatus == API_REQUEST_STATUS.fetching || willViewProduct) {
        return(
            <div>
                <Head>
                    <title>{t('page-title')} {TITLE_SEPARATOR} {t('header:site-name')}</title>
                </Head>
                <PageBody navType={PageBody.vars.NAV_TYPES.others}>
                    <LoadingView title={t('page-title')} message={t('common:fetching-user-data-message')} />
                </PageBody>
            </div>
        )
    }

    console.log("Sell:", "ProductLoad", defaultValuesStatus, defaultValuesError, defaultValues)
    if(defaultValuesError) {
        var errorMsg = ""
        if(defaultValuesError.error) {
            errorMsg = t(defaultValuesError.error)

        } else if(defaultValuesError.errors) {
            errorMsg = t(defaultValuesError.errors[Object.keys(defaultValuesError.errors)[0]])

        } else {
            errorMsg = t('common:error-try-again')
        }
        Swal.fire({
            text: errorMsg,
            confirmButtonText: t('common:ok'),
            cancelButtonText: t('common:ok')
        })
    }

    //take the user to the lofin page if the session is empty
    if (!session && !loading) {
        signIn()
    }

    // Once the user request finishes, show the user
    return (
    <div>
        <Head>
            <title>{t('page-title')} {TITLE_SEPARATOR} {t('header:site-name')}</title>
        </Head>
        <PageBody navType={PageBody.vars.NAV_TYPES.others}>
            <div className="page-content">
                <div className="d-flex justify-content-center align-items-center margin-b-20 h1 b text-cap">
                    {t(!isEdit? 'create-listing' : 'edit-listing')}
                </div>
                <div className="form-wrapper">
                    <div className="d-flex justify-content-between align-items-center margin-b-25">
                        <div className="h3 b text-cap">{t('listing-details')}</div>
                        <button onClick={() => reset(defaultValues)} className="btn btn-outline-success btn-sm text-cap">{t('common:reset-form')}</button>
                    </div>
                    <form onSubmit={onSubmit}>
                        <div className="form-group row">
                            <label for="title" className="required col-sm-2 col-form-label">{t('title')}:</label>
                            <InputBox error={titleError} className="col-sm-10">
                                <input onChange={handleChange} value={title} placeholder={t('title-placeholder')} id="title" name="title" type="text" className="form-control" />
                                <small class="form-text text-muted">{t('common:chars-remaining', {count: getCharsRem(formRule.title.maxChar[0],  title.length)})}</small>
                            </InputBox>
                        </div>

                        <div className={`form-group row ${cats?.length == 0? 'disabled-section' : ''}`}>
                            <label for="cat" className="required col-sm-2 col-form-label">{t('cat')}:</label>
                            <InputBox error={catError} className={`col-sm-10 ${catsStatus == API_REQUEST_STATUS.fetching? 'loading-section' : ''}`} attrs={{
                                'data-loading-msg': t('data-loading')
                            }}>
                                <select onChange={handleChange} value={cat} id="cat" name="cat" className="form-control">
                                    <option value="-1">---{t('cat-select')}---</option>
                                    {
                                        (cats || []).map((value, index) => {
                                            return <option key={index} value={value.id}>{value.name}</option>
                                        })
                                    }
                                </select>
                            </InputBox>
                        </div>

                        <div className={`form-group row ${subcats?.length == 0? 'disabled-section' : ''}`}>
                            <label for="subcat" className="required col-sm-2 col-form-label">{t('subcat')}:</label>
                            <InputBox error={subcatError} className={`col-sm-10 ${subcatsStatus == API_REQUEST_STATUS.fetching? 'loading-section' : ''}`} attrs={{
                                'data-loading-msg': t('data-loading')
                            }}>
                                <select onChange={handleChange} value={subcat} value={subcat} id="subcat" name="subcat" className="form-control">
                                    <option value="-1">---{t('select-subcat')}---</option>
                                    {
                                        (subcats || []).map((value, index) => {
                                            return <option key={index} value={value.id}>{value.name}</option>
                                        })
                                    }
                                </select>
                            </InputBox>
                        </div>

                        <div className="form-group row">
                            <label for="price" className="required col-sm-2 col-form-label">{t('price')}:</label>
                            <InputBox error={priceError} className="col-sm-10">
                                <input onChange={handleChange} value={price} placeholder={t('price-placeholder')} id="price" name="price" type="text" className="form-control" />
                            </InputBox>
                        </div>

                        <div className="form-group row">
                            <label for="description" className="col-sm-2 col-form-label">{t('description')}:</label>
                            <InputBox className="col-sm-10" error={descriptionError}>
                                <textarea onChange={handleChange} value={description} rows="3" placeholder={t('description-placeholder')} id="description" name="description" className="form-control" />
                                <small class="form-text text-muted">{t('common:chars-remaining', {count: getCharsRem(formRule.description.maxChar[0], description.length)})}</small>
                            </InputBox>
                        </div>

                        <div className={`form-group row ${countries?.length == 0? 'disabled-section' : ''}`}>
                            <label for="country" className="required col-12 col-form-label">{t('country')}:</label>
                            <InputBox error={countryError} className={`col-12 ${countriesStatus == API_REQUEST_STATUS.fetching? 'loading-section' : ''}`} attrs={{
                                'data-loading-msg': t('data-loading')
                            }}>
                                <select onChange={handleChange} value={country} id="country" name="country" className="form-control">
                                    <option value="-1">---{t('select-country')}---</option>
                                    {
                                        (countries || []).map((value, index) => {
                                            return <option key={index} value={value.id}>{value.name}</option>
                                        })
                                    }
                                </select>
                            </InputBox>
                        </div>
                        
                        <label for="file-select">{t('photos-label')}</label>
                        <InputBox error={photosError} className={styles["upload-form"]}>
                            <FileDrop
                            onFrameDragEnter={(event) => setDragOver(true)}
                            onFrameDragLeave={(event) => setDragOver(false)}
                            onFrameDrop={(event) => processFiles(event.dataTransfer.files)}
                            onDragOver={(event) => setDragOver(true)}
                            onDragLeave={(event) => {}}
                            onDrop={(files, event) => {}}
                            >
                                <label className="btn btn-primary" for="file-select">{t('select')}</label> &nbsp; <span>{t('ordragdrop')}</span>
                                <input
                                id="file-select"
                                style={{display: "none"}}
                                onChange={onFileInputChange}
                                type="file"
                                className="hidden"
                                multiple
                                />
                            </FileDrop>
                        </InputBox>
                        {
                        !winReady? null :
                            <div className={styles['upload-list']}>
                                <OrderlyListHr list={photos} itemKey="id" updateHandler={uploadListUpdateHandler} onItem={onUploadListItem} onListStyle={getListStyle} onItemStyle={getItemStyle} />
                            </div>
                        }

                        <div className="margin-t-25 d-flex justify-content-center align-items-center">
                            <button type="submit" className="btn btn-primary text-cap btn-lg">{t(!isEdit? 'submit-text' : 'submit-text-edit')}</button>
                        </div>
                    </form>
                </div>
                <VStack mt="15px" alignItems="center" fontSize="14px">
                    <Text as={Link} href="/tos" mb="5px" 
                    color="primary.900" 
                    _hover={{
                        color: "primary.900",
                        textDecor: "underline"
                    }}
                    >
                        {t('tos-ag')}
                    </Text>
                    <Text as={Link} href="/create-ad-tips" mb="5px" 
                    color="primary.900" 
                    _hover={{
                        color: "primary.900",
                        textDecor: "underline"
                    }}
                    >
                        <HStack>
                            <Box className="fa fa-info"></Box> 
                            {" "}
                            <Text color="primary.900">
                                {t('how-to-create')}
                            </Text>
                        </HStack>
                    </Text>
                </VStack>
            </div>
            <div className={styles["dragover-overlay"]} style={{display: dragOver? "block" : "none"}}></div>
            <Overlay show={showUploadProgress} outsideClickHandler={null} hasBg>
                <ProgressBar message={t('uploading-item')} style={{width: '100%', minWidth: '200px'}} level={uploadProgress} status={uploadStatus == 'error'? 'danger' : 'info'}  striped={uploadStatus == 'busy'? true : false} anim={uploadStatus == 'busy'? true : false} />
            </Overlay>
        </PageBody>
    </div>
    )
}