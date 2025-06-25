import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Save, Camera, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

const API_BASE_URL = 'http://localhost:5000/api'

export default function NovaConsulta() {
  const { pacienteId } = useParams()
  const navigate = useNavigate()
  
  const [paciente, setPaciente] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [formData, setFormData] = useState({
    anamnese: '',
    exame_fisico: '',
    acuidade_visual_od: '',
    acuidade_visual_oe: '',
    pressao_intraocular_od: '',
    pressao_intraocular_oe: '',
    diagnostico: '',
    plano_tratamento: '',
    observacoes: ''
  })

  useEffect(() => {
    if (pacienteId) {
      fetchPaciente()
    }
  }, [pacienteId])

  const fetchPaciente = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_BASE_URL}/pacientes/${pacienteId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setPaciente(data.paciente)
      } else {
        setError('Paciente não encontrado')
      }
    } catch (error) {
      setError('Erro ao carregar dados do paciente')
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_BASE_URL}/consultas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_paciente: parseInt(pacienteId),
          ...formData
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Consulta salva com sucesso!')
        setTimeout(() => {
          navigate('/consultas')
        }, 2000)
      } else {
        setError(data.error || 'Erro ao salvar consulta')
      }
    } catch (error) {
      setError('Erro de conexão. Verifique se o servidor está rodando.')
    } finally {
      setLoading(false)
    }
  }

  if (!pacienteId) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Nova Consulta</h1>
            <p className="text-gray-600">Selecione um paciente para iniciar a consulta</p>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-12 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Paciente não selecionado
            </h3>
            <p className="text-gray-600 mb-4">
              Vá para a lista de pacientes e selecione um paciente para iniciar uma nova consulta.
            </p>
            <Button onClick={() => navigate('/pacientes')} className="bg-blue-600 hover:bg-blue-700">
              Ver Pacientes
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nova Consulta</h1>
          {paciente && (
            <p className="text-gray-600">Paciente: {paciente.nome_completo}</p>
          )}
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Anamnese</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              name="anamnese"
              placeholder="Descreva os sintomas e histórico do paciente..."
              value={formData.anamnese}
              onChange={handleInputChange}
              rows={4}
              className="w-full"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Exame Físico</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="acuidade_visual_od">Acuidade Visual OD</Label>
                <Input
                  id="acuidade_visual_od"
                  name="acuidade_visual_od"
                  placeholder="Ex: 20/20"
                  value={formData.acuidade_visual_od}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="acuidade_visual_oe">Acuidade Visual OE</Label>
                <Input
                  id="acuidade_visual_oe"
                  name="acuidade_visual_oe"
                  placeholder="Ex: 20/20"
                  value={formData.acuidade_visual_oe}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pressao_intraocular_od">Pressão Intraocular OD (mmHg)</Label>
                <Input
                  id="pressao_intraocular_od"
                  name="pressao_intraocular_od"
                  placeholder="Ex: 15"
                  value={formData.pressao_intraocular_od}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="pressao_intraocular_oe">Pressão Intraocular OE (mmHg)</Label>
                <Input
                  id="pressao_intraocular_oe"
                  name="pressao_intraocular_oe"
                  placeholder="Ex: 16"
                  value={formData.pressao_intraocular_oe}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="exame_fisico">Outros achados do exame físico</Label>
              <Textarea
                id="exame_fisico"
                name="exame_fisico"
                placeholder="Descreva outros achados relevantes do exame físico..."
                value={formData.exame_fisico}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Diagnóstico</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              name="diagnostico"
              placeholder="Diagnóstico principal e diagnósticos diferenciais..."
              value={formData.diagnostico}
              onChange={handleInputChange}
              rows={3}
              className="w-full"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Plano de Tratamento</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              name="plano_tratamento"
              placeholder="Descreva o plano de tratamento proposto..."
              value={formData.plano_tratamento}
              onChange={handleInputChange}
              rows={3}
              className="w-full"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              name="observacoes"
              placeholder="Observações adicionais..."
              value={formData.observacoes}
              onChange={handleInputChange}
              rows={2}
              className="w-full"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Imagens e Exames</CardTitle>
          </CardHeader>
          <CardContent>
            <Button type="button" variant="outline" className="w-full">
              <Camera className="h-4 w-4 mr-2" />
              Adicionar Imagem
            </Button>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              'Salvando...'
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salvar Consulta
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

