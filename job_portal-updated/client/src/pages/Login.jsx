import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { FiArrowRight, FiBriefcase, FiCheckCircle, FiLock, FiMail, FiSearch, FiShield } from 'react-icons/fi'
import { loginUser } from '../features/auth/authSlice'
import getToastMessage from '../utils/getToastMessage'
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
    VisualCards,
    VisualCopy,
} from './AuthStyles'

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoading } = useSelector((state) => state.auth)

  async function onSubmit(data) {
    try {
        const response = await dispatch(loginUser(data))

        if (loginUser.fulfilled.match(response)) {
            toast.success('Login successful!')
            const savedId = localStorage.getItem('savedId')

            if (savedId) {
                localStorage.removeItem('savedId')
                navigate(`/apply-job/${savedId}`)
                return
            }

            const role = response.payload?.userDetail?.role

            if (role === 'admin') {
                navigate('/admin')
            } else if (role === 'user') {
                navigate('/user')
            }
        } else {
            toast.error(getToastMessage(response.payload, 'Login failed. Please check your credentials and try again.'))
        }
    } catch {
        toast.error('An error occurred during login. Please try again later.')
    }
  }

  return (
    <AuthPage>
      <AuthShell>
        <AuthVisual>
          <Brand><span><FiBriefcase /></span> HireNest</Brand>
          <VisualCopy>
            <h1>Welcome back to your hiring workspace.</h1>
            <p>Sign in to track applications, manage roles, and keep your next career move in motion.</p>
          </VisualCopy>
          <VisualCards>
            <MiniCard $wide>
              <FiSearch />
              <div><strong>Smart search</strong><span>Find roles and candidates faster.</span></div>
            </MiniCard>
            <MiniCard $offset>
              <FiShield />
              <div><strong>Secure access</strong><span>Protected dashboards for every role.</span></div>
            </MiniCard>
            <MiniCard $wide>
              <FiCheckCircle />
              <div><strong>Clear progress</strong><span>Stay updated from apply to approval.</span></div>
            </MiniCard>
          </VisualCards>
        </AuthVisual>

        <FormPanel>
          <FormHeader>
            <span><FiLock /> Login</span>
            <h2>Sign in</h2>
            <p>Use your registered email and password to continue.</p>
          </FormHeader>

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Field>
              <span><FiMail /> Email</span>
              <Input
                type="email"
                placeholder="name@example.com"
                $error={!!errors.email}
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
            </Field>

            <Field>
              <span><FiLock /> Password</span>
              <Input
                type="password"
                placeholder="Enter your password"
                $error={!!errors.password}
                {...register('password', { required: 'Password is required' })}
              />
              {errors.password && <ErrorText>{errors.password.message}</ErrorText>}
            </Field>

            <SubmitButton type="submit" disabled={isLoading}>
              {isLoading ? 'Signing in...' : <>Login <FiArrowRight /></>}
            </SubmitButton>
          </Form>

          <SwitchText>
            New here? <button type="button" onClick={() => navigate('/signup')}>Create an account</button>
          </SwitchText>
        </FormPanel>
      </AuthShell>
    </AuthPage>
  )
}
