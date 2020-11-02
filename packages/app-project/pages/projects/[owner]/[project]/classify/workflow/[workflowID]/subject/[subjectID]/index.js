export { default } from '@screens/ClassifyPage'

export function getServerSideProps({ params, req, res }) {
  const { subjectID, workflowID } = params
  const props = { subjectID, workflowID }
  return ({ props })
}