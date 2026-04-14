import { useEffect } from 'react'
import { useStore } from '../store/store'
import { api } from '../services/api'

export function useBootstrap() {
  const { setProgress, setLoading, setData } = useStore()

  useEffect(() => {
    ;(async () => {
      try {
        setProgress(8,  'Establishing uplink...')
        const { data: profile } = await api.profile.get()
        setData('profile', profile)

        setProgress(28, 'Mapping territories...')
        const [{ data: projects }, { data: skills }] = await Promise.all([
          api.projects.getAll(), api.skills.getAll()
        ])
        setData('projects', projects)
        setData('skills', skills)

        setProgress(55, 'Scanning records...')
        const [{ data: education }, { data: experience }] = await Promise.all([
          api.education.getAll(), api.experience.getAll()
        ])
        setData('education', education)
        setData('experience', experience)

        setProgress(80, 'Deploying surface...')
        const [{ data: certificates }, { data: achievements }] = await Promise.all([
          api.certificates.getAll(), api.achievements.getAll()
        ])
        setData('certificates', certificates)
        setData('achievements', achievements)

        setProgress(100, 'Launch sequence complete!')
        await new Promise(r => setTimeout(r, 700))
      } catch (e) {
        console.warn('API offline – running in demo mode', e)
        setProgress(100, 'Running in demo mode')
        await new Promise(r => setTimeout(r, 500))
      }
      setLoading(false)
    })()
  }, [])
}
