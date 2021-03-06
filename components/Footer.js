import useTranslation from "next-translate/useTranslation"
import { FACEBOOK_PAGE_LINK, INSTAGRAM_PAGE_LINK, TWITTER_PAGE_LINK } from "../utils/constants"
import Link from "../views/link"


export default function Footer() {
    const { t } = useTranslation('footer')

    return(
        <footer>
            <div className="row footer-color-grid-wrapper">
                <div className="col-1 footer-color-grid"></div>
                <div className="col-1 footer-color-grid"></div>
                <div className="col-1 footer-color-grid"></div>
                <div className="col-1 footer-color-grid"></div>
                <div className="col-1 footer-color-grid"></div>
                <div className="col-1 footer-color-grid"></div>
                <div className="col-1 footer-color-grid"></div>
                <div className="col-1 footer-color-grid"></div>
                <div className="col-1 footer-color-grid"></div>
                <div className="col-1 footer-color-grid"></div>
                <div className="col-1 footer-color-grid"></div>
                <div className="col-1 footer-color-grid"></div>
            </div>
            <div className="footer-links-wrapper container">
                <div className="footer-links-external">
                    <a target="_blank" href={FACEBOOK_PAGE_LINK}>
                        <i className="fa fa-2x fa-facebook"></i>
                    </a>
                    <a target="_blank" href={INSTAGRAM_PAGE_LINK}>
                        <i className="fa fa-2x fa-instagram"></i>
                    </a>
                    <a target="_blank" href={TWITTER_PAGE_LINK}>
                        <i className="fa fa-2x fa-twitter"></i>
                    </a>
                </div>
                <div className="footer-links-internal container">
                    <div className="footer-links-internal-box">
                        <Link href="/about">
                            {t("about-us")}
                        </Link>
                        <Link href="/contact">
                            {t("contact-us")}
                        </Link>
                        <Link href="/privacy">
                            {t("privacy-policy")}
                        </Link>
                        <Link href="/tos">
                            {t("tos")}
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}