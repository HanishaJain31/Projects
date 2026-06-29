import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import {
  FiArrowRight,
  FiBriefcase,
  FiCheckCircle,
  FiFileText,
  FiLock,
  FiMail,
  FiPhone,
  FiUploadCloud,
  FiUser,
  FiUsers,
} from 'react-icons/fi'
import { registerUser } from '../../features/auth/authSlice'
import getToastMessage from '../../utils/getToastMessage'
import {
  AuthPage,
  AuthShell,
  AuthVisual,
  Brand,
  ErrorText,
  Field,
  Form,
  FormHeader,
  FormPanel,
  Input,
  MiniCard,
  SubmitButton,
  SwitchText,
  UploadBox,
  UploadIcon,
  UploadText,
  VisualCards,
  VisualCopy,
} from '../AuthStyles'

export default function Signup() {
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoading, error } = useSelector((state) => state.auth)
  const role = 'user'
  const resumeValue = useWatch({ control, name: 'resume_path' })
  const resumeFile = resumeValue?.[0]

  async function onSubmit(data) {
    const formData = new FormData()

    formData.append('name', data.name)
    formData.append('email', data.email)
    formData.append('password', data.password)
    formData.append('phone_number', data.phone)
    formData.append('job_role', data.job_role)
    formData.append('role', role)
    if (data.resume_path && data.resume_path.length > 0) {
      formData.append('resume', data.resume_path[0])
    }

    const response = await dispatch(registerUser(formData))

    if (response.meta.requestStatus === 'fulfilled') {
      toast.success('Signup successful!')
      const savedJobId = localStorage.getItem('savedId')
      reset()
      if (savedJobId) {
        localStorage.removeItem('savedId')
        navigate(`/apply-job/${savedJobId}`)
      } else {
        navigate('/')
      }
    } else {
      toast.error(getToastMessage(response.payload, 'Signup failed. Please try again.'))
    }
  }

  return (
    <AuthPage>
      <AuthShell>
        <AuthVisual>
          <Brand><span><FiBriefcase /></span> HireNest</Brand>
          <VisualCopy>
            <h1>Create a profile that moves with your career.</h1>
            <p>Join the portal, save your resume, and apply to matching jobs with less friction.</p>
          </VisualCopy>
          <VisualCards>
            <MiniCard $wide>
              <FiUsers />
              <div><strong>Candidate profile</strong><span>Keep your details ready for applications.</span></div>
            </MiniCard>
            <MiniCard $offset>
              <FiFileText />
              <div><strong>Resume ready</strong><span>Attach your resume once and move faster.</span></div>
            </MiniCard>
            <MiniCard $wide>
              <FiCheckCircle />
              <div><strong>Quick apply</strong><span>Return directly to a saved job after signup.</span></div>
            </MiniCard>
          </VisualCards>
        </AuthVisual>

        <FormPanel>
          <FormHeader>
            <span><FiUser /> Signup</span>
            <h2>Create account</h2>
            <p>Set up your profile and start applying to roles.</p>
          </FormHeader>

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Field>
              <span><FiUser /> Name</span>
              <Input type="text" placeholder="Your full name" $error={!!errors.name} {...register('name', { required: 'Name is required' })} />
              {errors.name && <ErrorText>{errors.name.message}</ErrorText>}
            </Field>

            <Field>
              <span><FiMail /> Email</span>
              <Input type="email" placeholder="name@example.com" $error={!!errors.email} {...register('email', { required: 'Email is required' })} />
              {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
            </Field>

            <Field>
              <span><FiLock /> Password</span>
              <Input
                type="password"
                placeholder="Create a password"
                $error={!!errors.password}
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' },
                })}
              />
              {errors.password && <ErrorText>{errors.password.message}</ErrorText>}
            </Field>

            <Field>
              <span><FiPhone /> Phone</span>
              <Input
                type="text"
                placeholder="10 digit phone number"
                $error={!!errors.phone}
                {...register('phone', {
                  required: 'Phone is required',
                  pattern: { value: /^[0-9]{10}$/, message: 'Invalid phone number' },
                })}
              />
              {errors.phone && <ErrorText>{errors.phone.message}</ErrorText>}
            </Field>

            <Field>
              <span><FiBriefcase /> Job Role</span>
              <Input type="text" placeholder="Frontend Developer" $error={!!errors.job_role} {...register('job_role', { required: 'Job role is required' })} />
              {errors.job_role && <ErrorText>{errors.job_role.message}</ErrorText>}
            </Field>

            <UploadBox $error={!!errors.resume_path}>
              <UploadIcon><FiUploadCloud /></UploadIcon>
              <UploadText>
                <strong>{resumeFile ? resumeFile.name : 'Upload resume'}</strong>
                <p>{resumeFile ? `${Math.ceil(resumeFile.size / 1024)} KB selected` : 'Optional, PDF or document file preferred'}</p>
              </UploadText>
              <input type="file" accept=".pdf,.doc,.docx" {...register('resume_path')} />
            </UploadBox>

            <SubmitButton type="submit" disabled={isLoading}>
              {isLoading ? 'Creating account...' : <>Signup <FiArrowRight /></>}
            </SubmitButton>

            {error && <ErrorText>{getToastMessage(error, 'Signup failed. Please try again.')}</ErrorText>}
          </Form>

          <SwitchText>
            Already registered? <button type="button" onClick={() => navigate('/login')}>Login instead</button>
          </SwitchText>
        </FormPanel>
      </AuthShell>
    </AuthPage>
  )
}
