import Image from 'next/image';
import appPreviewImg from '../assets/app-nlw-copa-preview.png';
import logoImg from '../assets/logo.svg';
import userAvatarImg from '../assets/users-avatar-example.png';
import iconCheckImg from '../assets/icon-check.svg';
import { api } from '../lib/axios';
import { FormEvent, useState } from 'react';


interface HomeProps {
  poolCount: number;
  guessCount: number;
  userCount: number;
}

export const getServerSideProps = async () => {
  const [
    poolCountData,
    guessCountData,
    userCountData
  ] = await Promise.all([
    api.get('pools/count'),
    api.get('guesses/count'),
    api.get('users/count')
  ])

  return {
    props: {
      poolCount: poolCountData.data.count,
      guessCount: guessCountData.data.count,
      userCount: userCountData.data.count
    }
  }
}

export default function Home({
  poolCount,
  guessCount,
  userCount
}: HomeProps) {
  const [formData, setFormData] = useState('');

  const createPool = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const response = await api.post('/pools', {
        title: formData
      })

      const { code } = response.data

      await navigator.clipboard.writeText(code)

      alert(`Bolão criado com sucesso, o código é : ${code} e foi copiado para área de transferência!`)
      setFormData('')
    } catch (err) {
      alert('Falha ao cirar o bolão, tente novamente!')
    }
  }

  return (
    <div className='max-w-[1124px] h-screen mx-auto grid grid-cols-2 items-center gap-28'>
      <main>
        <Image src={logoImg} alt="NLW Copa" />

        <h1 className='mt-14 text-white text-5xl font-bold leading-tight'>
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className='mt-10 flex items-center gap-2'>
          <Image src={userAvatarImg} alt="Users" quality={100} />

          <strong className='text-gray-100 text-xl'>
            <span className='text-ignite-500'>+{userCount}</span> pessoas já estão usando
          </strong>
        </div>

        <form onSubmit={createPool} className='mt-10 flex gap-2'>
          <input
            type="text"
            required
            placeholder="Qual nome do seu bolão?"
            className='flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100'
            onChange={e => setFormData(e.target.value)}
            value={formData}
          />
          <button
            type="submit"
            className='bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700'
          >
            Criar seu bolão
          </button>
        </form>

        <p className='mt-4 text-sm text-gray-300 leading-relaxed'>
          Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀
        </p>

        <div className='mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100'>
          <div className='flex items-center gap-6'>
            <Image src={iconCheckImg} alt="" quality={100} />
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>
          <div className='w-px h-14 bg-gray-600' />
          <div className='flex items-center gap-6'>
            <Image src={iconCheckImg} alt="" quality={100} />
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image
        src={appPreviewImg}
        alt="Celulares exibindo preview"
        quality={100}
      />
    </div>
  )
}
