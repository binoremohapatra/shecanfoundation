import React, { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { submitContact } from '../api/client'

// ─── Zod Schema ────────────────────────────────────────────────────────────
const schema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^\d*$/, 'Phone number must contain only digits').optional().or(z.literal('')),
  helpType: z.enum(['volunteer', 'donate', 'partner', 'awareness'], {
    error: 'Please select how you would like to help',
  }),
  message: z
    .string()
    .min(10, 'Please share at least 10 characters about your story'),
})

type FormValues = z.infer<typeof schema>

// ─── Animated Checkmark ──────────────────────────────────────────────────
const AnimatedCheckmark: React.FC = () => (
  <svg
    width="80"
    height="80"
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <motion.circle
      cx="40" cy="40" r="36"
      stroke="#E8452A"
      strokeWidth="4"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    />
    <motion.path
      d="M22 41L34 53L58 28"
      stroke="#0D1B2A"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: 0.55 }}
    />
  </svg>
)

// ─── Confetti Burst ──────────────────────────────────────────────────────
const ConfettiBurst: React.FC = () => (
  <div className="confetti-container" aria-hidden="true">
    {Array.from({ length: 12 }).map((_, i) => (
      <div key={i} className="confetti-piece" />
    ))}
  </div>
)

// ─── Field Error ─────────────────────────────────────────────────────────
const FieldError: React.FC<{ message?: string }> = ({ message }) => (
  <AnimatePresence>
    {message && (
      <motion.p
        className="form-error"
        role="alert"
        initial={{ opacity: 0, y: -6, height: 0 }}
        animate={{ opacity: 1, y: 0, height: 'auto' }}
        exit={{ opacity: 0, y: -6, height: 0 }}
        transition={{ duration: 0.2 }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
          <path d="M6 0a6 6 0 100 12A6 6 0 006 0zm0 9a.75.75 0 110-1.5A.75.75 0 016 9zm.75-3.75a.75.75 0 01-1.5 0V3.75a.75.75 0 011.5 0V5.25z"/>
        </svg>
        {message}
      </motion.p>
    )}
  </AnimatePresence>
)

// ─── Success State ────────────────────────────────────────────────────────
const SuccessState: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.94 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    className="flex flex-col items-center text-center py-12 px-6 relative"
    role="status"
    aria-live="polite"
  >
    <div className="relative mb-6">
      <AnimatedCheckmark />
      <ConfettiBurst />
    </div>
    <motion.h3
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.45 }}
      className="font-display font-bold text-navy text-3xl md:text-4xl mb-4"
    >
      Thank You, Champion!
    </motion.h3>
    <motion.p
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0, duration: 0.4 }}
      className="font-body text-charcoal/70 text-lg max-w-sm leading-relaxed"
    >
      We've received your message and will reach out within 48 hours.{' '}
      <span className="text-flame font-semibold">Together, she can.</span>
    </motion.p>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.3 }}
      className="mt-8 flex gap-3"
    >
      <div className="w-2 h-2 rounded-full bg-blush animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-2 h-2 rounded-full bg-flame animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-2 h-2 rounded-full bg-navy animate-bounce" style={{ animationDelay: '300ms' }} />
    </motion.div>
  </motion.div>
)

// ─── Main Form ────────────────────────────────────────────────────────────
const ContactForm: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px 0px' })
  const shouldReduce = useReducedMotion()
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), mode: 'onTouched' })

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setLoading(true)
    try {
      await submitContact({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone ?? '',
        helpType: data.helpType,
        message: data.message,
      })
      setSubmitted(true)
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Something went wrong. Please try again.'
      toast.error(msg, {
        style: { background: '#0D1B2A', color: 'white', fontFamily: '"DM Sans", sans-serif' },
      })
    } finally {
      setLoading(false)
    }
  }

  const inputClass = (hasError: boolean) =>
    `form-input ${hasError ? 'border-red-400 bg-red-50/30' : ''}`

  return (
    <section
      id="form"
      ref={ref}
      className="bg-ivory py-20 md:py-28 relative overflow-hidden"
      aria-label="Contact and volunteer form"
    >
      {/* Decorative blobs */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl -translate-y-1/2 translate-x-1/2"
        style={{ background: '#F9C5B0' }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-15 blur-3xl translate-y-1/3 -translate-x-1/3"
        style={{ background: '#E8452A' }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-3xl mx-auto px-5 sm:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduce ? 0 : 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-12"
        >
          <p className="font-body font-medium text-flame uppercase tracking-widest text-xs mb-3">
            Get Involved
          </p>
          <h2 className="font-display font-bold text-navy" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>
            Join Our Mission
          </h2>
          <p className="font-body text-charcoal/60 mt-3 max-w-md mx-auto">
            Whether you want to volunteer, donate, partner, or simply spread the word — we'd love to hear from you.
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduce ? 0 : 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="bg-white rounded-2xl shadow-card overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {submitted ? (
              <SuccessState key="success" />
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: shouldReduce ? 0 : -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Form top accent */}
                <div className="h-1.5 w-full bg-gradient-to-r from-flame via-blush to-navy" />

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                  className="p-8 md:p-10"
                  aria-label="Volunteer and contact form"
                >
                  <div className="space-y-6">

                    {/* Full Name + Email */}
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="fullName" className="form-label">
                          Full Name <span className="text-flame">*</span>
                        </label>
                        <input
                          id="fullName"
                          type="text"
                          autoComplete="name"
                          placeholder="Jane Doe"
                          className={inputClass(!!errors.fullName)}
                          aria-required="true"
                          aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                          aria-invalid={!!errors.fullName}
                          {...register('fullName')}
                        />
                        <FieldError message={errors.fullName?.message} />
                      </div>

                      <div>
                        <label htmlFor="email" className="form-label">
                          Email Address <span className="text-flame">*</span>
                        </label>
                        <input
                          id="email"
                          type="email"
                          autoComplete="email"
                          placeholder="jane@example.com"
                          className={inputClass(!!errors.email)}
                          aria-required="true"
                          aria-invalid={!!errors.email}
                          {...register('email')}
                        />
                        <FieldError message={errors.email?.message} />
                      </div>
                    </div>

                    {/* Phone + Help Type */}
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="phone" className="form-label">
                          Phone Number
                          <span className="text-charcoal/40 font-normal ml-1">(optional)</span>
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          autoComplete="tel"
                          placeholder="08012345678"
                          className={inputClass(!!errors.phone)}
                          aria-invalid={!!errors.phone}
                          {...register('phone')}
                        />
                        <FieldError message={errors.phone?.message} />
                      </div>

                      <div>
                        <label htmlFor="helpType" className="form-label">
                          How would you like to help? <span className="text-flame">*</span>
                        </label>
                        <select
                          id="helpType"
                          className={`${inputClass(!!errors.helpType)} appearance-none cursor-pointer`}
                          aria-required="true"
                          aria-invalid={!!errors.helpType}
                          {...register('helpType')}
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%232C2C2C' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 1rem center',
                          }}
                        >
                          <option value="">Select an option...</option>
                          <option value="volunteer">Volunteer</option>
                          <option value="donate">Donate</option>
                          <option value="partner">Partner with Us</option>
                          <option value="awareness">Spread Awareness</option>
                        </select>
                        <FieldError message={errors.helpType?.message} />
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="form-label">
                        Tell us your story <span className="text-flame">*</span>
                      </label>
                      <textarea
                        id="message"
                        rows={5}
                        placeholder="Share why you want to get involved, your experiences, or how you hope to contribute..."
                        className={`${inputClass(!!errors.message)} resize-none`}
                        aria-required="true"
                        aria-invalid={!!errors.message}
                        {...register('message')}
                      />
                      <FieldError message={errors.message?.message} />
                    </div>

                    {/* Privacy note */}
                    <p className="font-body text-xs text-charcoal/40 leading-relaxed">
                      By submitting, you agree to our{' '}
                      <a href="#" className="text-flame hover:underline">Privacy Policy</a>.
                      We respect your data and will never share it with third parties.
                    </p>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      id="submit-form-btn"
                      disabled={loading}
                      whileHover={!loading ? { scale: 1.03, filter: 'brightness(1.1)' } : {}}
                      whileTap={!loading ? { scale: 0.98 } : {}}
                      className="w-full bg-flame text-white font-body font-semibold py-4 px-8 rounded-full
                                 flex items-center justify-center gap-3 text-base transition-all duration-200
                                 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                      aria-label={loading ? 'Submitting your story...' : 'Send my story'}
                    >
                      {loading ? (
                        <>
                          <span className="spinner" aria-hidden="true" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          Send My Story
                          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M4 10h12M10 4l6 6-6 6" />
                          </svg>
                        </>
                      )}
                    </motion.button>

                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

export default ContactForm
