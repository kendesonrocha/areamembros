// src/services/circleApi.ts
// Usar backend local em vez de chamar Circle API diretamente
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'
const USE_BACKEND = import.meta.env.VITE_USE_BACKEND !== 'false' // true por padrão

interface CircleApiResponse<T> {
  success: boolean
  data: T
  error?: string
}

// Debug: Verificar configuração
console.log('🔧 API Config:', {
  backendUrl: BACKEND_URL,
  useBackend: USE_BACKEND
})

// Dados mockados realistas para fallback (caso backend não esteja disponível)
const MOCK_STATS = {
  members_count: 1247,
  posts_count: 523,
  comments_count: 2156
}

// Função para testar conectividade com o backend
export async function testCircleConnection(): Promise<CircleApiResponse<any>> {
  try {
    console.log('🧪 Testando conexão com backend...')
    
    if (!USE_BACKEND) {
      throw new Error('Backend desabilitado')
    }

    const response = await fetch(`${BACKEND_URL}/api/circle/test`)
    
    if (!response.ok) {
      throw new Error(`Backend Error ${response.status}`)
    }
    
    const result = await response.json()
    console.log('✅ Backend conectado:', result)
    return result
  } catch (error) {
    console.error('❌ Erro ao conectar com backend:', error)
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Backend não disponível'
    }
  }
}

// Obter estatísticas da comunidade através do backend
export async function getCommunityStats(): Promise<CircleApiResponse<{
  members_count: number
  posts_count: number
  comments_count: number
}>> {
  try {
    console.log('📊 Buscando estatísticas da comunidade via backend...')
    
    if (!USE_BACKEND) {
      console.log('🔄 Backend desabilitado, usando dados mockados...')
      return { 
        success: true, 
        data: MOCK_STATS,
        error: 'Dados simulados - Backend desabilitado'
      }
    }

    const response = await fetch(`${BACKEND_URL}/api/circle/stats`)
    
    if (!response.ok) {
      throw new Error(`Backend Error ${response.status}`)
    }
    
    const result = await response.json()
    
    if (result.success) {
      console.log('✅ Estatísticas reais carregadas do backend:', result.data)
      return result
    } else {
      throw new Error(result.error || 'Erro ao buscar estatísticas')
    }
  } catch (error) {
    console.error('❌ Erro ao buscar estatísticas:', error)
    
    // Fallback para dados mockados se backend não estiver disponível
    console.log('🔄 Usando dados mockados como fallback...')
    return {
      success: true,
      data: MOCK_STATS,
      error: 'Dados simulados - Backend não disponível'
    }
  }
}

// Obter posts recentes através do backend
export async function getRecentPosts(limit = 10) {
  try {
    if (!USE_BACKEND) {
      return { success: false, data: [], error: 'Backend desabilitado' }
    }

    const response = await fetch(`${BACKEND_URL}/api/circle/posts?limit=${limit}`)
    
    if (!response.ok) {
      throw new Error(`Backend Error ${response.status}`)
    }
    
    const result = await response.json()
    return result
  } catch (error) {
    console.error('Erro ao buscar posts:', error)
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }
  }
}

// Obter membros ativos através do backend
export async function getActiveMembers(limit = 10) {
  try {
    if (!USE_BACKEND) {
      return { success: false, data: [], error: 'Backend desabilitado' }
    }

    const response = await fetch(`${BACKEND_URL}/api/circle/members?limit=${limit}`)
    
    if (!response.ok) {
      throw new Error(`Backend Error ${response.status}`)
    }
    
    const result = await response.json()
    return result
  } catch (error) {
    console.error('Erro ao buscar membros:', error)
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }
  }
}
