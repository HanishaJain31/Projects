import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import styled from 'styled-components'
import { createJobByAdmin } from '../../features/admin/adminJobSlice'
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
  width: min(100%, 640px);
  max-height: 90vh;
  overflow-y: auto;
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
  grid-template-columns: repeat(2, minmax(0, 1fr));
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
  grid-column: 1 / -1;
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
  grid-column: 1 / -1;
`

const Button = styled.button`
  padding: 10px 16px;
  border: 1px solid ${({ theme, variant }) => variant === 'secondary' ? theme.border : theme.primary};
  border-radius: 6px;
  background: ${({ theme, variant }) => variant === 'secondary' ? theme.surfaceAlt : theme.primary};
  color: ${({ theme, variant }) => variant === 'secondary' ? theme.text : '#fff'};
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }
`

const Field = styled.div`
  display: grid;
  gap: 5px;
`

const FullField = styled(Field)`
  grid-column: 1 / -1;
`

const ErrorText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.danger};
  font-size: 13px;
`

export default function CreateJobAction({ isOpen, onClose, onCreated }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      status: 'active',
      job_type: 'full_time',
    }
  })
  const dispatch = useDispatch()
  const { isLoading } = useSelector((state) => state.adminJob)

  if (!isOpen) return null

  async function onSubmit(data) {
    const skills = String(data.skills || '')
      .split(',')
      .map((skill) => Number(skill.trim()))
      .filter(Boolean)

    const action = await dispatch(createJobByAdmin({
      job_name: data.job_name,
      company_name: data.company_name,
      location: data.location,
      latitude: Number(data.latitude),
      longitude: Number(data.longitude),
      job_salary: Number(data.job_salary),
      description: data.description,
      status: data.status,
      experience_required: data.experience_required,
      job_type: data.job_type,
      skills,
    }))

    if (createJobByAdmin.fulfilled.match(action)) {
      if (action.payload?.code === '1') {
        toast.success('Job created successfully')
        reset()
        onCreated?.()
        onClose()
      } else {
        toast.error(getToastMessage(action.payload, 'Could not create job'))
      }
    } else {
      toast.error(getToastMessage(action.payload, 'Could not create job'))
    }
  }

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(event) => event.stopPropagation()}>
        <Header>
          <Title>Create Job</Title>
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
            <Input type="number" step="any" placeholder="Latitude" {...register('latitude', { required: 'Latitude is required', valueAsNumber: true })} />
            {errors.latitude && <ErrorText>{errors.latitude.message}</ErrorText>}
          </Field>
          <Field>
            <Input type="number" step="any" placeholder="Longitude" {...register('longitude', { required: 'Longitude is required', valueAsNumber: true })} />
            {errors.longitude && <ErrorText>{errors.longitude.message}</ErrorText>}
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
            <Input type="text" placeholder="Experience Required" {...register('experience_required', { required: 'Experience is required' })} />
            {errors.experience_required && <ErrorText>{errors.experience_required.message}</ErrorText>}
          </Field>
          <Field>
            <Input
              type="text"
              placeholder="Skill IDs comma separated, e.g. 1,2"
              {...register('skills', {
                required: 'At least one skill id is required',
                validate: (value) => String(value).split(',').some((skill) => Number(skill.trim())) || 'Enter numeric skill ids'
              })}
            />
            {errors.skills && <ErrorText>{errors.skills.message}</ErrorText>}
          </Field>
          <Field>
            <Select {...register('status', { required: 'Status is required' })}>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
            </Select>
            {errors.status && <ErrorText>{errors.status.message}</ErrorText>}
          </Field>
          <Field>
            <Select {...register('job_type', { required: 'Job type is required' })}>
              <option value="full_time">Full Time</option>
              <option value="part_time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
              <option value="remote">Remote</option>
            </Select>
            {errors.job_type && <ErrorText>{errors.job_type.message}</ErrorText>}
          </Field>
          <FullField>
            <Textarea
              placeholder="Description"
              {...register('description', {
                required: 'Description is required',
                minLength: { value: 20, message: 'Description must be at least 20 characters' }
              })}
            />
            {errors.description && <ErrorText>{errors.description.message}</ErrorText>}
          </FullField>

          <Actions>
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>{isLoading ? 'Creating...' : 'Create'}</Button>
          </Actions>
        </Form>
      </Modal>
    </Overlay>
  )
}
