import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import styled from 'styled-components'
import { updateJobById } from '../../features/admin/adminJobSlice'
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
  width: min(100%, 520px);
  padding: 24px;
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 10px;
  box-shadow: ${({ theme }) => theme.shadow};
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
`

const Title = styled.h2`
  margin: 0;
  font-size: 24px;
`

const CloseButton = styled.button`
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.text};
  font-size: 24px;
  cursor: pointer;
`

const Form = styled.form`
  display: grid;
  gap: 12px;
`

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 6px;
`

const Textarea = styled.textarea`
  width: 100%;
  min-height: 90px;
  padding: 10px;
  border-radius: 6px;
  resize: vertical;
`

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border-radius: 6px;
`

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
`

const Button = styled.button`
  padding: 10px 16px;
  border: 1px solid ${({ theme, variant }) => variant === 'secondary' ? theme.border : theme.primary};
  border-radius: 6px;
  background: ${({ theme, variant }) => variant === 'secondary' ? theme.surfaceAlt : theme.primary};
  color: ${({ theme, variant }) => variant === 'secondary' ? theme.text : '#fff'};
  cursor: pointer;

  &:hover {
    background: ${({ theme, variant }) => variant === 'secondary' ? theme.card : theme.primaryHover};
  }
`

const Field = styled.div`
  display: grid;
  gap: 5px;
`

const ErrorText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.danger};
  font-size: 13px;
`

export default function EditJobAction({ isOpen, job, onClose }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const dispatch = useDispatch()
  const { isLoading } = useSelector((state) => state.adminJob)

  useEffect(() => {
    if (job) {
      reset({
        job_name: job.job_name || '',
        company_name: job.company_name || '',
        location: job.location || '',
        job_salary: job.job_salary || '',
        description: job.description || job.job_description || '',
        status: job.status || 'active',
      })
    }
  }, [job, reset])

  if (!isOpen || !job) return null

  async function onSubmit(data) {
    const action = await dispatch(updateJobById({
      job_id: job.job_id || job.id,
      job_name: data.job_name,
      company_name: data.company_name,
      location: data.location,
      job_salary: Number(data.job_salary),
      description: data.description,
      status: data.status,
    }))

    if (updateJobById.fulfilled.match(action)) {
      if (action.payload?.code === '1') {
        toast.success('Job updated successfully')
        onClose()
      } else {
        toast.error(getToastMessage(action.payload, 'Could not update job'))
      }
    } else {
      toast.error(getToastMessage(action.payload, 'Could not update job'))
    }
  }

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(event) => event.stopPropagation()}>
        <Header>
          <Title>Edit Job</Title>
          <CloseButton type="button" onClick={onClose}>x</CloseButton>
        </Header>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Field>
            <Input type="text" placeholder="Job Name" {...register('job_name', { required: 'Job name is required' })} />
            {errors.job_name && <ErrorText>{errors.job_name.message}</ErrorText>}
          </Field>
          <Field>
            <Input type="text" placeholder="Company Name" {...register('company_name', { required: 'Company name is required' })} />
            {errors.company_name && <ErrorText>{errors.company_name.message}</ErrorText>}
          </Field>
          <Field>
            <Input type="text" placeholder="Location" {...register('location', { required: 'Location is required' })} />
            {errors.location && <ErrorText>{errors.location.message}</ErrorText>}
          </Field>
          <Field>
            <Input
              type="number"
              placeholder="Salary"
              {...register('job_salary', {
                required: 'Salary is required',
                valueAsNumber: true,
                validate: (value) => Number.isFinite(value) || 'Salary must be numeric'
              })}
            />
            {errors.job_salary && <ErrorText>{errors.job_salary.message}</ErrorText>}
          </Field>
          <Field>
            <Textarea
              placeholder="Description"
              {...register('description', {
                required: 'Description is required',
                minLength: { value: 20, message: 'Description must be at least 20 characters' }
              })}
            />
            {errors.description && <ErrorText>{errors.description.message}</ErrorText>}
          </Field>
          <Field>
            <Select {...register('status', { required: 'Status is required' })}>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
            </Select>
            {errors.status && <ErrorText>{errors.status.message}</ErrorText>}
          </Field>

          <Actions>
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save'}</Button>
          </Actions>
        </Form>
      </Modal>
    </Overlay>
  )
}
