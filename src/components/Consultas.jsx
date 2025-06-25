import { useState, useEffect } from 'react'
import { Search, Plus, Eye, Edit, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const API_BASE_URL = 'http://localhost:5000/api'

export default function Consultas() {
  const [consultas, setConsultas] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchConsultas()
  }, [currentPage])

  const fetchConsultas = async () => {
    try {
      const token = localStorage.getItem('token')
      const params = new URLSearchParams({
        page: currentPage,
        per_page: 10
      })

      const response = await fetch(`${API_BASE_URL}/consultas?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setConsultas(data.consultas)
        setTotalPages(data.pages)
      }
    } catch (error) {
      console.error('Erro ao buscar consultas:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR')
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Consultas</h1>
        </div>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Consultas</h1>
          <p className="text-gray-600">Histórico de consultas realizadas</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Nova Consulta
        </Button>
      </div>

      <div className="grid gap-4">
        {consultas.map((consulta) => (
          <Card key={consulta.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {consulta.paciente?.nome_completo || 'Paciente não encontrado'}
                    </h3>
                    <Badge variant="outline">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(consulta.data_consulta)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {consulta.anamnese && (
                      <div>
                        <span className="font-medium text-gray-700">Anamnese:</span>
                        <p className="text-gray-600 mt-1 line-clamp-2">
                          {consulta.anamnese}
                        </p>
                      </div>
                    )}
                    
                    {consulta.diagnostico && (
                      <div>
                        <span className="font-medium text-gray-700">Diagnóstico:</span>
                        <p className="text-gray-600 mt-1 line-clamp-2">
                          {consulta.diagnostico}
                        </p>
                      </div>
                    )}
                    
                    {(consulta.acuidade_visual_od || consulta.acuidade_visual_oe) && (
                      <div>
                        <span className="font-medium text-gray-700">Acuidade Visual:</span>
                        <div className="text-gray-600 mt-1">
                          {consulta.acuidade_visual_od && (
                            <span className="mr-4">OD: {consulta.acuidade_visual_od}</span>
                          )}
                          {consulta.acuidade_visual_oe && (
                            <span>OE: {consulta.acuidade_visual_oe}</span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {(consulta.pressao_intraocular_od || consulta.pressao_intraocular_oe) && (
                      <div>
                        <span className="font-medium text-gray-700">Pressão Intraocular:</span>
                        <div className="text-gray-600 mt-1">
                          {consulta.pressao_intraocular_od && (
                            <span className="mr-4">OD: {consulta.pressao_intraocular_od} mmHg</span>
                          )}
                          {consulta.pressao_intraocular_oe && (
                            <span>OE: {consulta.pressao_intraocular_oe} mmHg</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-3 text-xs text-gray-500">
                    Realizada em: {formatDateTime(consulta.data_consulta)}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Ver Detalhes
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {consultas.length === 0 && !loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma consulta encontrada
            </h3>
            <p className="text-gray-600 mb-4">
              Comece realizando sua primeira consulta.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nova Consulta
            </Button>
          </CardContent>
        </Card>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <span className="flex items-center px-4 text-sm text-gray-600">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Próxima
          </Button>
        </div>
      )}
    </div>
  )
}

