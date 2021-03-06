import { Box, Flex } from "@chakra-ui/react"


const buildCat = () => {

}
const subCatLink = () => {

}
const CosmoboxCats = () => {
    return(
        <div className="side-inner">
        <div className="b-categories-listing-outer">
            <div onMouseLeave={this.clearSubCats} className="b-categories-listing-inner b-categories-listing-inner--small-box-shadow">
                <div className="b-categories-listing__item b-categories-listing__parents">
                    <div id="side_bar_scroll" className="b-categories-listing__item__inner">
                        <div>
                            <Flex display={{base: "none", md: showUpCatScoller? "flex" : "none"}} cursor="pointer" position="absolute" left={0} top={0} w="100%" h="35px" justifyContent="center" alignItems="center" 
                            bgGradient="linear(to-b, rgba(246,248,253,.74) 74%, rgba(246,248,253,0))" onClick={scrollUp}>
                                <i className="fa fa-caret-up"></i>
                            </Flex>
                            <div className="categories-innermost-wrapper">
                                {
                                    this.state.cats && this.state.cats.length > 0 && this.state.cats[0].id == CAT_ID_FLASH_AD? 
                                    this.buildCat(this.state.cats[0], 0, this.state.totalFlashProducts, flashLink())
                                : null
                                }
                                {
                                    this.state.cats.map((cat, index) => (
                                        cat.id == CAT_ID_FLASH_AD? null :
                                        this.buildCat(cat, index, cat.total_products, catLink(cat.indentifier, cat.id))
                                    ))
                                }

                            </div>
                            <Flex display={{base: "none", md: showDownCatScoller? "flex" : "none"}} cursor="pointer" position="absolute" left={0} bottom={0} w="100%" h="35px" justifyContent="center" alignItems="center" 
                            bgGradient="linear(to-t, rgba(246,248,253,.74) 74%, rgba(246,248,253,0))" onClick={scrollDown}>
                                <i className="fa fa-caret-down"></i>
                            </Flex>
                        </div>
                    </div>
                </div>
                <div className={"sm-hide-down qa-categories-sub-tree b-categories-listing__item b-categories-listing__childes"+(this.state.sub_cats.length == 0? " hides":"")}>
                    <div className="b-categories-listing__item b-categories-listing__parents">
                        <div id="side_bar_scroll_sub" className="b-categories-listing__item__inner">
                            <div>
                                <div id="scat-up" onClick={this.handleClick} data-source="sup" className="hide b-scrolling-helper b-scrolling-helper--top">
                                    <svg data-source="sup" className="up" style={{width: "16px", height: "16px", maxWidth: "16px", maxHeight: "16px", fill: "rgb(128, 128, 128)", stroke: "inherit"}}>
                                        <use data-source="up" xlinkHref="#up">
                                        </use>
                                    </svg>
                                </div>
                                <div className="b-categories-listing__item__inner">
                                    {
                                        this.state.sub_cats.map((sCat, index) => (
                                            <Link to={subCatLink(sCat.name, sCat.id)} key={"sub_cat_"+index} className={"b-categories-item h-ph-10 b-categories-item--item-alt qa-category-sub-item cat_and_sub_"+this.state.cat_id} data-index={index} data-id={this.state.cat_id}>
                                                <span className="b-categories-item--outer" data-index={index} data-id={this.state.cat_id}>
                                                    <span className="h-flex-center" data-index={index} data-id={this.state.cat_id}>
                                                        <span className="b-categories-item--inner" data-index={index} data-id={this.state.cat_id}>
                                                            <span className="qa-category-parent-name b-category-parent-name" data-index={index} data-id={this.state.cat_id}>
                                                                {sCat.name}
                                                            </span>
                                                            <span className="b-list-category-stack__item-link--found b-black" data-index={index} data-id={this.state.cat_id}>
                                                                <span data-index={index} data-id={this.state.cat_id}>
                                                                    {commaNum(sCat.total_products) + " " + getText("ADVERTS_LOWERCASE")}
                                                                </span>
                                                            </span>
                                                        </span>
                                                    </span>
                                                </span>
                                            </Link>
                                        ))
                                    }
                                </div>
                                <div id="scat-down" onClick={this.handleClick} data-source="sdown" className="hide b-scrolling-helper b-scrolling-helper--bottom">
                                    <svg data-source="sdown" className="down" style={{width: "16px", height: "16px", maxWidth: "16px", maxHeight: "16px", fill: "rgb(128, 128, 128)", stroke: "inherit"}}>
                                        <use data-source="sdown" xlinkHref="#down">
                                        </use>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
    )
}

export default CosmoboxCats