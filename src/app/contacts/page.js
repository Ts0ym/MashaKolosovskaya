import InnerInfoPageTemplate from "@/components/InnerInfoPageTemplate.client";

import styles from "./page.module.scss";

export default function ContactsPage() {
  return (
    <InnerInfoPageTemplate
      key="contacts"
      pageKey="contacts"
      title="Contacts"
      imagePanelLabel="Contacts artwork"
      imageSrc="/Images/Contacts/contacts.png"
      imageAlt="Artwork with a pale background and a horizontal strip with small orange flower forms"
      mobileImageWidth={768}
      mobileImageHeight={1037}
      desktopImageObjectPosition="50% 52%"
      mobileImageObjectPosition="50% 52%"
    >
      <div className={styles.group}>
        <p>Masha Kolosovskaya</p>
        <p>
          <a href="mailto:kolosovskaya.m@gmail.com" className={styles.link}>
            kolosovskaya.m@gmail.com
          </a>
        </p>
        <p>+7 (916) 669-16-16</p>
      </div>

      <div className={styles.group}>
        <p>Instagram:</p>
        <p>
          <a
            href="https://www.instagram.com/kolosovskaya_mari/"
            target="_blank"
            rel="noreferrer"
            className={styles.link}
          >
            https://www.instagram.com/kolosovskaya_mari/
          </a>
        </p>
      </div>
    </InnerInfoPageTemplate>
  );
}
