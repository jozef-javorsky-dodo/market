import React, { ReactElement, useState, useEffect } from 'react'
import { useAsset } from '@context/Asset'
import styles from './index.module.css'
import Tabs from '@shared/atoms/Tabs'
import EditMetadata from './EditMetadata'
import Page from '@shared/Page'
import Loader from '@shared/atoms/Loader'
import Alert from '@shared/atoms/Alert'
import contentPage from '../../../../content/pages/edit.json'
import Container from '@shared/atoms/Container'

export default function Edit({ uri }: { uri: string }): ReactElement {
  const { asset, error, isInPurgatory, title, isOwner } = useAsset()
  const [pageTitle, setPageTitle] = useState<string>('')

  useEffect(() => {
    if (!asset) return

    const pageTitle = isInPurgatory
      ? ''
      : !isOwner
      ? 'Edit action not available'
      : `Edit ${title}`

    setPageTitle(pageTitle)
  }, [asset, isInPurgatory, title, isOwner])

  const tabs = [
    {
      title: 'Edit Metadata',
      content: <EditMetadata asset={asset} />
    }
  ].filter((tab) => tab !== undefined)

  return (
    <Page title={pageTitle} description={contentPage.description} uri={uri}>
      {!asset?.accessDetails ? (
        <Loader />
      ) : !isOwner ? (
        <Alert
          title="Edit action available only to asset owner"
          text={error}
          state="error"
        />
      ) : (
        <Container className={styles.container}>
          <Tabs items={tabs} defaultIndex={0} className={styles.edit} />
        </Container>
      )}
    </Page>
  )
}
