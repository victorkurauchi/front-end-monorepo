export { default } from '@screens/ClassifyPage'

export function getServerSideProps({ params, req, res }) {
  const { subjectID, subjectSetID, workflowID } = params
  const props = { subjectID, subjectSetID, workflowID }
  return ({ props })
}