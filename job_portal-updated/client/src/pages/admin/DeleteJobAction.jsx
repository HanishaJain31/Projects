import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import styled from 'styled-components'
import { deleteJobById } from '../../features/admin/adminJobSlice'
import getToastMessage from '../../utils/getToastMessage'

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: ${({ theme }) => theme.overlay};
`

const Modal = styled.div`
  width: min(100%, 420px);
  padding: 24px;
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 10px;
  box-shadow: ${({ theme }) => theme.shadow};
`

const Title = styled.h2`
  margin: 0 0 10px;
  font-size: 24px;
`

const Text = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.mutedText};
  line-height: 1.5;
`

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
`

const Button = styled.button`
  padding: 10px 16px;
  border: 1px solid ${({ theme, variant }) => variant === 'secondary' ? theme.border : theme.danger};
  border-radius: 6px;
  background: ${({ theme, variant }) => variant === 'secondary' ? theme.surfaceAlt : theme.danger};
  color: ${({ theme, variant }) => variant === 'secondary' ? theme.text : '#fff'};
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }
`

export default function DeleteJobAction({ isOpen, job, onClose }) {
  const dispatch = useDispatch()
  const { isLoading } = useSelector((state) => state.adminJob)

  if (!isOpen || !job) return null

  async function handleDelete() {
    const action = await dispatch(deleteJobById(job.job_id || job.id))

    if (deleteJobById.fulfilled.match(action)) {
      if (action.payload?.code === '1') {
        toast.success('Job deleted successfully')
        onClose()
      } else {
        toast.error(getToastMessage(action.payload, 'Could not delete job'))
      }
    } else {
      toast.error(getToastMessage(action.payload, 'Could not delete job'))
    }
  }

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(event) => event.stopPropagation()}>
        <Title>Delete Job</Title>
        <Text>Are you sure you want to delete "{job.job_name}"? This action cannot be undone.</Text>

        <Actions>
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="button" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </Actions>
      </Modal>
    </Overlay>
  )
}
