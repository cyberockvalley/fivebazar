import { Box, Text } from "@chakra-ui/react";
import useTranslation from "next-translate/useTranslation";
import SearchBox from "../../widgets/search-box";

const HeaderBannerCosmobox = ({search, buttonAction, buttonText}) => {
  const { t } = useTranslation('header')
  return (
    <div style={{display: "none"}} className="banner d-md-block">
      <div className="container">
        <div className="banner-text">
          <Box>
            <Text>{t('find-in')}</Text>
            <i className="fa fa-map-marker" bg="#000" opacity="0.1"></i>
          </Box>
          {
            !search? null :
            <SearchBox {...search} />
          }
          {
            !buttonText? null :
            <button
              type="button"
              className="btn btn-warning text-dark btn-banner text-upper"
              onClick={buttonAction}
            >
              {buttonText}
            </button>
          }
        </div>
      </div>
    </div>
  );
}

export default HeaderBannerCosmobox
