//import PropTypes from 'prop'
import Head from 'next/head'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import HomeTab from '../components/home/HomeTab'
import { PRODUCTS_PER_PAGE, THEME, TITLE_SEPARATOR } from '../utils/constants'
import PageBody from '../components/PageBody'
import LoadingView from '../components/LoadingView'
import { useEffect, useState } from 'react'
import { API_OPTIONS } from './api/[...v1]'
import { STATUS_CODES } from '../api'
import { getSession } from 'next-auth/client'
import { Box, Flex, HStack, Text } from '@chakra-ui/react'
import Products from '../components/home/Products'

const $ = require('jquery')

const Home = ({cats, catsPosts, viewer}) => {
  const { t, lang } = useTranslation()
  const router = useRouter()

  const [catsState, setCatsState] = useState(cats || [])
  const [catsPostsState, setCatsPostsState] = useState(catsPosts) 
  const [viewerState, setViewerState] = useState(viewer)

  //update cats
  useEffect(() => {
    setCatsState(cats)
  }, [cats])
  //update catsPosts
  useEffect(() => {
    setCatsPostsState(catsPosts)
  }, [catsPosts])
  //update viewer
  useEffect(() => {
    setViewerState(viewer)
  }, [viewer])

  const [showUpCatScoller, setShowUpCatScoller] = useState(false)
  const [showDownCatScoller, setShowDownCatScoller] = useState(false)
  const [scrollerUsed, setScrollerUsed] = useState(false)

  useEffect(() => {
    var catsEl = $("#cats")
    if(catsEl) {
      catsEl = catsEl[0]
      if(catsEl.offsetHeight == catsEl.scrollHeight) {
        setShowUpCatScoller(false)
        setShowDownCatScoller(false)

      } else {
        setShowUpCatScoller(true)
        setShowDownCatScoller(true)

        console.log("CATS_DIV:", catsEl.offsetHeight, catsEl.scrollHeight, catsEl.scrollTop)
        
        if(catsEl.scrollTop == 0) {
          setShowUpCatScoller(false)

        }
        
        if(catsEl.scrollHeight - catsEl.offsetHeight == catsEl.scrollTop) {
          setShowDownCatScoller(false)
        }
      }
      
    }
  }, [scrollerUsed])

  if (!catsState || !catsPostsState) {
    return(
        <div>
            <Head>
                <title>{t('common:site-desc')} {TITLE_SEPARATOR} {t('header:site-name')}</title>
            </Head>
            <PageBody navType={PageBody.vars.NAV_TYPES.home}>
                <LoadingView />
            </PageBody>
        </div>
    )
  }

  const scrollUp = () => {
    const pane = $("#cats")[0]
    const by = pane.offsetHeight
    console.log("scroll:", "UP", by, pane)
    pane.scrollTop += -1 * by
    setScrollerUsed(!scrollerUsed)
  }

  const scrollDown = () => {
    const pane = $("#cats")[0]
    const by = pane.offsetHeight
    console.log("scroll:", "DOWN", by, pane)
    pane.scrollTop += by
    setScrollerUsed(!scrollerUsed)
  }

  console.log("CATS::", catsState)
  return (
    <div>
      <Head>
        <title>{t('common:site-desc')} {TITLE_SEPARATOR} {t('header:site-name')}</title>
      </Head>
      <PageBody navType={PageBody.vars.NAV_TYPES.home} className="m-0 p-0 w-100 mw-100 h-100">
        {
          THEME == "fivebazar"?
          <HomeTab cats={catsState} catsPosts={catsPostsState} viewer={viewerState} />
          :
          <Flex position="relative" direction={{base: "column", md: "row"}} w="100%" h="100%" pt={{base: "60px", md: "0px"}}>
            <Box position="relative" w={{md: "305px"}} maxW={{md: "25%"}} h="100%"  pt={{base: "0px", md: "16px"}}>
              
              <HStack position="absolute" zIndex={100} w={{md: "100%"}} h="100%" bgColor="#fff" boxShadow="0 2px 4px rgb(0 0 0 / 10%), 0 8px 16px rgb(0 0 0 / 10%)">
                <Box position="relative" w={{md: "100%"}} h="100%">
                  <HStack id="cats" mx={{base: 0, md: '8px'}} position="relative" 
                  maxH="120px" overflowY={{base: 'hidden', md: "auto"}}>
                    
                    <Flex overflowY="hidden" py="1" fontWeight="bold" direction={{base: "row", md: "column"}} justifyContent={{base: "space-between", md: "flex-start"}} alignItems={{md: "flex-start"}}>
                      <Flex cursor="pointer" display={{base: "flex", md: "none"}} px="2" direction="column" minW={{base: "25%", md: "100%"}} w={{base: "25%", md: "100%"}}>
                        <Text className="fa fa-list" fontSize="1.2em" color="primary.900"></Text>
                        <Text className="more-text" fontSize=".75rem">
                          {t('home:browse-all')}
                        </Text>
                      </Flex>
                      {
                        (catsState || []).map((cat, index) => {
                          return (
                            <Flex _hover={{
                              bg: "#EEF2F4"
                            }} cursor="pointer" px="2" py={{base: 0, md: "1"}} direction={{base: "column", md: "row"}} alignItems={{md: "center"}} minW={{base: "25%", md: "100%"}} w={{base: "25%", md: "100%"}}>
                              <Text mr={{base: 0, md: "8px"}} className="fa fa-list" fontSize="1.2em" color="primary.900"></Text>
                              <HStack alignItems="center" justifyContent={'space-between'} w="100%">
                                <Text className="more-text" fontSize=".75rem">
                                  {cat.name}
                                </Text>
                                <Text className="fa fa-caret-right" display={{base: 'none', md: 'block'}}></Text>
                              </HStack>
                            </Flex>
                          )
                        })
                      }
                    </Flex>
                  </HStack>
                  <Flex display={{base: "none", md: showUpCatScoller? "flex" : "none"}} cursor="pointer" position="absolute" left={0} top={0} w="100%" h="35px" justifyContent="center" alignItems="center" 
                  bgGradient="linear(to-b, rgba(246,248,253,.74) 74%, rgba(246,248,253,0))" onClick={scrollUp}>
                    <i className="fa fa-caret-up"></i>
                  </Flex>
                  <Flex display={{base: "none", md: showDownCatScoller? "flex" : "none"}} cursor="pointer" position="absolute" left={0} bottom={0} w="100%" h="35px" justifyContent="center" alignItems="center" 
                  bgGradient="linear(to-t, rgba(246,248,253,.74) 74%, rgba(246,248,253,0))" onClick={scrollDown}>
                    <i className="fa fa-caret-down"></i>
                  </Flex>
                </Box>
                
                <Box position="relative" w={{md: "100%"}} h="100%">
                  <HStack id="cats" mx={{base: 0, md: '8px'}} position="relative" 
                  maxH="120px" overflowY={{base: 'hidden', md: "auto"}}>
                    
                    <Flex overflowY="hidden" py="1" fontWeight="bold" direction={{base: "row", md: "column"}} justifyContent={{base: "space-between", md: "flex-start"}} alignItems={{md: "flex-start"}}>
                      <Flex cursor="pointer" display={{base: "flex", md: "none"}} px="2" direction="column" minW={{base: "25%", md: "100%"}} w={{base: "25%", md: "100%"}}>
                        <Text className="fa fa-list" fontSize="1.2em" color="primary.900"></Text>
                        <Text className="more-text" fontSize=".75rem">
                          {t('home:browse-all')}
                        </Text>
                      </Flex>
                      {
                        (catsState || []).map((cat, index) => {
                          return (
                            <Flex _hover={{
                              bg: "#EEF2F4"
                            }} cursor="pointer" px="2" py={{base: 0, md: "1"}} direction={{base: "column", md: "row"}} alignItems={{md: "center"}} minW={{base: "25%", md: "100%"}} w={{base: "25%", md: "100%"}}>
                              <Text mr={{base: 0, md: "8px"}} className="fa fa-list" fontSize="1.2em" color="primary.900"></Text>
                              <HStack alignItems="center" justifyContent={'space-between'} w="100%">
                                <Text className="more-text" fontSize=".75rem">
                                  {cat.name}
                                </Text>
                                <Text className="fa fa-caret-right" display={{base: 'none', md: 'block'}}></Text>
                              </HStack>
                            </Flex>
                          )
                        })
                      }
                    </Flex>
                  </HStack>
                  <Flex display={{base: "none", md: showUpCatScoller? "flex" : "none"}} cursor="pointer" position="absolute" left={0} top={0} w="100%" h="35px" justifyContent="center" alignItems="center" 
                  bgGradient="linear(to-b, rgba(246,248,253,.74) 74%, rgba(246,248,253,0))" onClick={scrollUp}>
                    <i className="fa fa-caret-up"></i>
                  </Flex>
                  <Flex display={{base: "none", md: showDownCatScoller? "flex" : "none"}} cursor="pointer" position="absolute" left={0} bottom={0} w="100%" h="35px" justifyContent="center" alignItems="center" 
                  bgGradient="linear(to-t, rgba(246,248,253,.74) 74%, rgba(246,248,253,0))" onClick={scrollDown}>
                    <i className="fa fa-caret-down"></i>
                  </Flex>
                </Box>
              </HStack>
            </Box>
            <Box p="3" w={{base: "100%", md: "70%"}} h="100%" pt="16px">
              <Products products={catsPostsState[(catsState || [{}])[0].text_id] || []} viewer={viewerState} />
            </Box>
          </Flex>
        }
      </PageBody>
    </div>
  )
}

export default Home

export const getServerSideProps = async ({ params, req, locale, query }) => {
  const Sequelize = require("sequelize")
  const getDb = require('../database/get-db')
  const DB = getDb(API_OPTIONS.database)
  
  var props = {}
  var redirect = null

  const { Cat, SubCat, Product, User, Review, UserList } = getTables(API_OPTIONS.database, ["Cat", "SubCat", "Product", "User", "Review", "UserList"], locale, API_OPTIONS.defaultLocale)
  try {
    //select the current cat is the current category the user want to see its products or more 
    //of its products
    var currentCat = params?.cat
    var currentCatId
    var noCats = query.no_cats
    console.log("CH_:", currentCat, params)
    //get cats along with subcats
    var cats = []
    if(!noCats) {
      Cat.hasMany(SubCat, {foreignKey: 'cat_id'})
      SubCat.belongsTo(Cat, {foreignKey: 'cat_id'})
      cats = await Cat.findAll({
        include: [{
            model: SubCat
        }],
        order: [
          ['weight', 'DESC'],
          ['name', 'ASC']
        ]
      }) || []

      if(!currentCat) {
        currentCat = cats[0].text_id
        currentCatId = cats[0].id
      }
     
    }
    
    
    var viewer = null
    //get the viewer id
    var userId
    const session = await getSession({req})
    var user = session?.user || {}
    userId = user?.id
    viewer = {id: user.id, image: user.image}

    //get the products of the current cat
    var catsPosts = []
    var page = query?.page || 1
    if(page < 1) page = 1
    var offset = (page - 1) * PRODUCTS_PER_PAGE

    if(currentCat) {
      switch (currentCat) {
        case 'latest-deal':
          var products = await Product.findAll({
            where: {is_flash: true},
            order: [
              ['flash_last_update', 'DESC']
            ],
            limit: PRODUCTS_PER_PAGE, offset: offset
          }) || []

          var query = `
            SELECT 

            \`products\`.*, 

            \`cats\`.\`text_id\` AS \`catTextId\`,
            \`subcats\`.\`text_id\` AS \`subcatTextId\`,

            \`seller\`.\`name\` AS \`sellerName\`, \`seller\`.\`username\` AS \`sellerUsername\`, 
            \`seller\`.\`image\` AS \`sellerImage\`, 

            IF(\`user_lists\`.\`product_id\` > 0, true, false) AS \`liked\`,

            COALESCE(AVG(\`reviews\`.\`rating\`), 0) AS \`avgRating\`, 
            COALESCE(COUNT(\`reviews\`.\`rating\`), 0) AS \`totalRatings\` 

            FROM (
                SELECT \`products\`.\`id\`, \`products\`.\`seller_id\` AS \`sellerId\`, \`products\`.\`cat\`, \`products\`.\`subcat\`, 
                \`products\`.\`country\`, \`products\`.\`title\`, \`products\`.\`description\`, \`products\`.\`currency_code\`, 
                \`products\`.\`price\`, \`products\`.\`photos\`, \`products\`.\`reviewed\`, \`products\`.\`sold_out\`, 
                \`products\`.\`is_flash\`, \`products\`.\`flash_last_update\`, \`products\`.\`created_at\` AS \`createdAt\`, 
                \`products\`.\`updated_at\` AS \`updatedAt\` FROM \`products\` AS \`products\`
                WHERE \`products\`.\`is_flash\` = 1
                ORDER BY \`products\`.\`flash_last_update\` DESC LIMIT ?, ?
            ) AS \`products\` 
            LEFT OUTER JOIN \`cats\` ON \`products\`.\`cat\` = \`cats\`.\`id\`
            LEFT OUTER JOIN \`subcats\` ON \`products\`.\`subcat\` = \`subcats\`.\`id\`
            LEFT OUTER JOIN \`nextauth_users\` AS \`seller\` ON \`products\`.\`sellerId\` = \`seller\`.\`id\` 
            LEFT OUTER JOIN \`reviews\` AS \`reviews\` ON \`products\`.\`id\` = \`reviews\`.\`product_id\` 
            LEFT OUTER JOIN (SELECT \`product_id\` FROM  \`user_lists\` WHERE \`removed\` = 0 AND \`user_id\` = ?) AS \`user_lists\` ON \`user_lists\`.\`product_id\` = \`products\`.\`id\`
            GROUP BY id ORDER BY \`flash_last_update\` DESC
            `
            var products = await DB.query(query, {
              replacements: [offset, PRODUCTS_PER_PAGE, viewer?.id || -1],
              raw: true, 
              type: Sequelize.QueryTypes.SELECT,
              model: Product,
              mapToModel: true
            })

          catsPosts = {
            "latest-deal": products
          }
          break;
        case 'new':
          var query = `
            SELECT 

            \`products\`.*, 

            \`cats\`.\`text_id\` AS \`catTextId\`,
            \`subcats\`.\`text_id\` AS \`subcatTextId\`,

            \`seller\`.\`name\` AS \`sellerName\`, \`seller\`.\`username\` AS \`sellerUsername\`, 
            \`seller\`.\`image\` AS \`sellerImage\`, 

            IF(\`user_lists\`.\`product_id\` > 0, true, false) AS \`liked\`,

            COALESCE(AVG(\`reviews\`.\`rating\`), 0) AS \`avgRating\`, 
            COALESCE(COUNT(\`reviews\`.\`rating\`), 0) AS \`totalRatings\` 

            FROM (
                SELECT \`products\`.\`id\`, \`products\`.\`seller_id\` AS \`sellerId\`, \`products\`.\`cat\`, \`products\`.\`subcat\`, 
                \`products\`.\`country\`, \`products\`.\`title\`, \`products\`.\`description\`, \`products\`.\`currency_code\`, 
                \`products\`.\`price\`, \`products\`.\`photos\`, \`products\`.\`reviewed\`, \`products\`.\`sold_out\`, 
                \`products\`.\`is_flash\`, \`products\`.\`flash_last_update\`, \`products\`.\`created_at\` AS \`createdAt\`, 
                \`products\`.\`updated_at\` AS \`updatedAt\` FROM \`products\` AS \`products\`
                ORDER BY \`products\`.\`created_at\` DESC LIMIT ?, ?
            ) AS \`products\` 
            LEFT OUTER JOIN \`cats\` ON \`products\`.\`cat\` = \`cats\`.\`id\`
            LEFT OUTER JOIN \`subcats\` ON \`products\`.\`subcat\` = \`subcats\`.\`id\`
            LEFT OUTER JOIN \`nextauth_users\` AS \`seller\` ON \`products\`.\`sellerId\` = \`seller\`.\`id\` 
            LEFT OUTER JOIN \`reviews\` AS \`reviews\` ON \`products\`.\`id\` = \`reviews\`.\`product_id\` 
            LEFT OUTER JOIN (SELECT \`product_id\` FROM  \`user_lists\` WHERE \`removed\` = 0 AND \`user_id\` = ?) AS \`user_lists\` ON \`user_lists\`.\`product_id\` = \`products\`.\`id\`
            GROUP BY id ORDER BY \`createdAt\` DESC
            `
            var products = await DB.query(query, {
              replacements: [offset, PRODUCTS_PER_PAGE, viewer?.id || -1],
              raw: true, 
              type: Sequelize.QueryTypes.SELECT,
              model: Product,
              mapToModel: true
            })

          catsPosts = {
            "new": products
          }
          break;
      
        default:
          if(!currentCatId) {
            var catGet = await Cat.findOne({
              where: {text_id: currentCat}
            })
            if(catGet) currentCatId = catGet.id
          }
          if(!currentCatId) {
            props.errorCode = STATUS_CODES.NOT_FOUND

          } else {

            var query = `
            SELECT 

            \`products\`.*, 

            \`cats\`.\`text_id\` AS \`catTextId\`,
            \`subcats\`.\`text_id\` AS \`subcatTextId\`,

            \`seller\`.\`name\` AS \`sellerName\`, \`seller\`.\`username\` AS \`sellerUsername\`, 
            \`seller\`.\`image\` AS \`sellerImage\`, 

            IF(\`user_lists\`.\`product_id\` > 0, true, false) AS \`liked\`,

            COALESCE(AVG(\`reviews\`.\`rating\`), 0) AS \`avgRating\`, 
            COALESCE(COUNT(\`reviews\`.\`rating\`), 0) AS \`totalRatings\` 

            FROM (
                SELECT \`products\`.\`id\`, \`products\`.\`seller_id\` AS \`sellerId\`, \`products\`.\`cat\`, \`products\`.\`subcat\`, 
                \`products\`.\`country\`, \`products\`.\`title\`, \`products\`.\`description\`, \`products\`.\`currency_code\`, 
                \`products\`.\`price\`, \`products\`.\`photos\`, \`products\`.\`reviewed\`, \`products\`.\`sold_out\`, 
                \`products\`.\`is_flash\`, \`products\`.\`flash_last_update\`, \`products\`.\`created_at\` AS \`createdAt\`, 
                \`products\`.\`updated_at\` AS \`updatedAt\` FROM \`products\` AS \`products\` 
                WHERE \`products\`.\`cat\` = ? ORDER BY \`products\`.\`updated_at\` DESC LIMIT ?, ?
            ) AS \`products\` 
            LEFT OUTER JOIN \`cats\` ON \`products\`.\`cat\` = \`cats\`.\`id\`
            LEFT OUTER JOIN \`subcats\` ON \`products\`.\`subcat\` = \`subcats\`.\`id\`
            LEFT OUTER JOIN \`nextauth_users\` AS \`seller\` ON \`products\`.\`sellerId\` = \`seller\`.\`id\` 
            LEFT OUTER JOIN \`reviews\` AS \`reviews\` ON \`products\`.\`id\` = \`reviews\`.\`product_id\` 
            LEFT OUTER JOIN (SELECT \`product_id\` FROM  \`user_lists\` WHERE \`removed\` = 0 AND \`user_id\` = ?) AS \`user_lists\` ON \`user_lists\`.\`product_id\` = \`products\`.\`id\`
            GROUP BY id ORDER BY \`updatedAt\` DESC
            `
            var products = await DB.query(query, {
              replacements: [currentCatId, offset, PRODUCTS_PER_PAGE, viewer?.id || -1],
              raw: true, 
              type: Sequelize.QueryTypes.SELECT,
              model: Product,
              mapToModel: true
            })

            catsPosts = {
              [currentCat]: products
            }
            console.log("PROPS::M", products.length, JSON.parse(JSON.stringify(products)))
          }
          break;
      }
    }

    if(props.errorCode) {
        if(props.errorCode == STATUS_CODES.NOT_FOUND) return {notFound: true}
        return {
            redirect: {
                destination: `/errors/${props.errorCode}`,
                permanent: false,
            }
        }

    } else if(redirect) {
        return {
            redirect: {
              destination: redirect,
              permanent: true,
            }
        }

    } else {
        props = JSON.parse(JSON.stringify(
          {
            cats: cats,
            catsPosts: catsPosts,
            viewer: viewer
          }
        ))
        console.log("PROPSZ:", props)
        return {
            props: props
        }
    }
      
  } catch(e) {
      console.log("CATZ::E", "SERVER_ERROR", e)
      return {
          redirect: {
              destination: `/errors/${STATUS_CODES.INTERNAL_SERVER_ERROR}`,
              permanent: false,
          }
      }
  }
}
