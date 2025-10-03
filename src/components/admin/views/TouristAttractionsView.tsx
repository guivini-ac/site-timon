import { useState, useEffect } from "react";
import {
  MapPin,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Eye,
  EyeOff,
  Camera,
  Clock,
  Phone,
  Star,
  StarOff,
  Users,
  Building2,
  Church,
  TreePine,
  Utensils,
  ShoppingBag,
  Music,
  MoreHorizontal,
  Upload,
} from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../ui/card";
import { Badge } from "../../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Switch } from "../../ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../ui/alert-dialog";
import { Checkbox } from "../../ui/checkbox";
import { toast } from "sonner";
import { useAdmin } from "../AdminContext";
import { EmptyState } from "../components/EmptyState";
import {
  BulkActions,
  useBulkSelection,
  type BulkAction,
} from "../components/BulkActions";
import { ImageWithFallback } from "../../figma/ImageWithFallback";

interface TouristAttraction {
  id: number;
  name: string;
  description: string;
  shortDescription: string;
  category:
    | "religioso"
    | "historico"
    | "cultural"
    | "natural"
    | "gastronomia"
    | "comercio";
  address: string;
  phone?: string;
  hours: string;
  image: string;
  rating: number;
  reviews: number;
  highlights: string[];
  coordinates?: { lat: number; lng: number };
  entrance: "gratuito" | "pago";
  price?: string;
  accessibility: boolean;
  parking: boolean;
  tips: string[];
  status: "active" | "inactive" | "draft";
  createdAt: string;
  updatedAt: string;
}

const categories = [
  {
    id: "religioso",
    label: "Religioso",
    icon: Church,
    color: "bg-purple-100 text-purple-800",
  },
  {
    id: "historico",
    label: "Histórico",
    icon: Building2,
    color: "bg-amber-100 text-amber-800",
  },
  {
    id: "cultural",
    label: "Cultural",
    icon: Music,
    color: "bg-pink-100 text-pink-800",
  },
  {
    id: "natural",
    label: "Natural",
    icon: TreePine,
    color: "bg-green-100 text-green-800",
  },
  {
    id: "gastronomia",
    label: "Gastronomia",
    icon: Utensils,
    color: "bg-orange-100 text-orange-800",
  },
  {
    id: "comercio",
    label: "Comércio",
    icon: ShoppingBag,
    color: "bg-blue-100 text-blue-800",
  },
];

// Dados mockados iniciais
const mockAttractions: TouristAttraction[] = [
  {
    id: 1,
    name: "Igreja Matriz de São José",
    description:
      "Principal igreja católica de Timon, construída no século XIX, é um marco arquitetônico e religioso da cidade. Possui bela arquitetura colonial e abriga importantes celebrações religiosas da comunidade timonense.",
    shortDescription:
      "Principal igreja católica com arquitetura colonial do século XIX",
    category: "religioso",
    address: "Praça da Matriz, Centro, Timon - MA",
    phone: "(99) 3212-1234",
    hours: "Segunda a sexta: 6h às 18h | Domingos: 6h às 20h",
    image:
      "https://images.unsplash.com/photo-1734698144161-de5f72411b1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmF6aWxpYW4lMjBjaHVyY2glMjBjb2xvbmlhbHxlbnwxfHx8fDE3NTczNDA4OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.6,
    reviews: 127,
    highlights: [
      "Arquitetura colonial",
      "Missas dominicais",
      "Centro histórico",
      "Patrimônio religioso",
    ],
    entrance: "gratuito",
    accessibility: true,
    parking: true,
    tips: [
      "Visite durante as missas dominicais para vivenciar a tradição local",
      "Aproveite para conhecer o centro histórico ao redor",
      "Fotografias são permitidas, mas seja respeitoso durante celebrações",
    ],
    status: "active",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
  },
  {
    id: 2,
    name: "Porto do Parnaíba",
    description:
      "Histórico porto fluvial às margens do Rio Parnaíba, importante para o desenvolvimento econômico da região. Oferece belas vistas do rio e é local de partida para passeios de barco e contemplação do pôr do sol.",
    shortDescription:
      "Porto histórico às margens do Rio Parnaíba com vista panorâmica",
    category: "historico",
    address: "Margem do Rio Parnaíba, Centro, Timon - MA",
    hours: "24 horas (área externa)",
    image:
      "https://images.unsplash.com/photo-1662434148029-c8a6cca90ea1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJuYWliYSUyMHJpdmVyJTIwZG9ja3xlbnwxfHx8fDE3NTczNDA4OTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.3,
    reviews: 89,
    highlights: [
      "Vista do Rio Parnaíba",
      "Pôr do sol",
      "História local",
      "Passeios de barco",
    ],
    entrance: "gratuito",
    accessibility: false,
    parking: true,
    tips: [
      "Melhor horário para visita é no fim da tarde",
      "Leve protetor solar e chapéu",
      "Ideal para caminhadas e contemplação",
    ],
    status: "active",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-18",
  },
  {
    id: 3,
    name: "Mercado Municipal de Timon",
    description:
      "Centro comercial tradicional onde você encontra produtos locais, artesanatos, especiarias e comidas típicas da região. É um local vibrante que representa a cultura e o comércio local timonense.",
    shortDescription:
      "Mercado tradicional com produtos locais e artesanatos regionais",
    category: "comercio",
    address: "Rua do Comércio, 123, Centro, Timon - MA",
    phone: "(99) 3212-5678",
    hours: "Segunda a sábado: 6h às 18h | Domingos: 6h às 12h",
    image:
      "https://images.unsplash.com/photo-1719836179378-9d847f713c46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtdW5pY2lwYWwlMjBtYXJrZXQlMjBicmF6aWx8ZW58MXx8fHwxNzU3MzQwOTAzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.4,
    reviews: 156,
    highlights: [
      "Produtos regionais",
      "Artesanato local",
      "Comidas típicas",
      "Cultura popular",
    ],
    entrance: "gratuito",
    accessibility: true,
    parking: true,
    tips: [
      "Experimente as frutas regionais da estação",
      "Pechinche os preços dos artesanatos",
      "Vá cedo para encontrar os melhores produtos",
    ],
    status: "draft",
    createdAt: "2024-01-12",
    updatedAt: "2024-01-19",
  },
];

export function TouristAttractionsView() {
  const { setBreadcrumbs, addNotification } = useAdmin();
  const [attractions, setAttractions] =
    useState<TouristAttraction[]>(mockAttractions);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState<string>("all");
  const [statusFilter, setStatusFilter] =
    useState<string>("all");
  const [currentAttraction, setCurrentAttraction] =
    useState<TouristAttraction | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] =
    useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] =
    useState(false);
  const [attractionToDelete, setAttractionToDelete] =
    useState<TouristAttraction | null>(null);

  // Form state
  const [formData, setFormData] = useState<
    Partial<TouristAttraction>
  >({
    name: "",
    description: "",
    shortDescription: "",
    category: "cultural",
    address: "",
    phone: "",
    hours: "",
    image: "",
    entrance: "gratuito",
    price: "",
    accessibility: false,
    parking: false,
    highlights: [],
    tips: [],
    status: "draft",
  });

  useEffect(() => {
    setBreadcrumbs([
      { label: "Dashboard", href: "#" },
      { label: "Pontos Turísticos" },
    ]);
  }, [setBreadcrumbs]);

  // Filtrar atrações
  const filteredAttractions = attractions.filter(
    (attraction) => {
      const matchesSearch =
        attraction.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        attraction.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" ||
        attraction.category === categoryFilter;
      const matchesStatus =
        statusFilter === "all" ||
        attraction.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    },
  );

  // Bulk actions usando o hook padrão
  const bulkSelection = useBulkSelection(filteredAttractions);

  const getCategoryData = (category: string) => {
    return categories.find((cat) => cat.id === category);
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      draft: "bg-yellow-100 text-yellow-800",
    };

    const statusLabels = {
      active: "Ativo",
      inactive: "Inativo",
      draft: "Rascunho",
    };

    return {
      style:
        statusStyles[status as keyof typeof statusStyles] ||
        statusStyles.draft,
      label:
        statusLabels[status as keyof typeof statusLabels] ||
        "Rascunho",
    };
  };

  const handleCreateAttraction = () => {
    setFormData({
      name: "",
      description: "",
      shortDescription: "",
      category: "cultural",
      address: "",
      phone: "",
      hours: "",
      image: "",
      entrance: "gratuito",
      price: "",
      accessibility: false,
      parking: false,
      highlights: [],
      tips: [],
      status: "draft",
    });
    setIsCreateModalOpen(true);
  };

  const handleEditAttraction = (
    attraction: TouristAttraction,
  ) => {
    setCurrentAttraction(attraction);
    setFormData(attraction);
    setIsEditModalOpen(true);
  };

  const handleDeleteAttraction = (
    attraction: TouristAttraction,
  ) => {
    setAttractionToDelete(attraction);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (attractionToDelete) {
      setAttractions((prev) =>
        prev.filter((a) => a.id !== attractionToDelete.id),
      );
      toast.success(
        `Ponto turístico "${attractionToDelete.name}" removido com sucesso!`,
      );
      addNotification({
        type: "success",
        title: "Ponto turístico removido",
        message: `${attractionToDelete.name} foi removido da lista`,
      });
    }
    setIsDeleteDialogOpen(false);
    setAttractionToDelete(null);
  };

  const handleSaveAttraction = () => {
    if (
      !formData.name ||
      !formData.description ||
      !formData.address
    ) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (isEditModalOpen && currentAttraction) {
      // Editar atração existente
      setAttractions((prev) =>
        prev.map((a) =>
          a.id === currentAttraction.id
            ? ({
                ...a,
                ...formData,
                updatedAt: new Date()
                  .toISOString()
                  .split("T")[0],
                highlights: formData.highlights || [],
                tips: formData.tips || [],
              } as TouristAttraction)
            : a,
        ),
      );
      toast.success(
        `Ponto turístico "${formData.name}" atualizado com sucesso!`,
      );
      addNotification({
        type: "success",
        title: "Ponto turístico atualizado",
        message: `${formData.name} foi atualizado`,
      });
    } else {
      // Criar nova atração
      const newAttraction: TouristAttraction = {
        id: Date.now(),
        rating: 0,
        reviews: 0,
        coordinates: undefined,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
        highlights: formData.highlights || [],
        tips: formData.tips || [],
        ...formData,
      } as TouristAttraction;

      setAttractions((prev) => [newAttraction, ...prev]);
      toast.success(
        `Ponto turístico "${formData.name}" criado com sucesso!`,
      );
      addNotification({
        type: "success",
        title: "Novo ponto turístico",
        message: `${formData.name} foi adicionado à lista`,
      });
    }

    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setCurrentAttraction(null);
  };

  // Bulk actions handlers seguindo o padrão da GalleryView
  const handleBulkAction = (
    actionId: string,
    selectedIds: string[],
  ) => {
    switch (actionId) {
      case "delete":
        selectedIds.forEach((id) => {
          const numericId = parseInt(id);
          setAttractions((prev) =>
            prev.filter((a) => a.id !== numericId),
          );
        });
        bulkSelection.clearSelection();
        addNotification({
          type: "success",
          title: `${selectedIds.length} ponto${selectedIds.length !== 1 ? "s" : ""} turístico${selectedIds.length !== 1 ? "s" : ""} excluído${selectedIds.length !== 1 ? "s" : ""}`,
          message:
            "Os pontos turísticos selecionados foram excluídos com sucesso.",
        });
        break;

      case "publish":
        selectedIds.forEach((id) => {
          const numericId = parseInt(id);
          const attraction = attractions.find(
            (a) => a.id === numericId,
          );
          if (attraction && attraction.status !== "active") {
            setAttractions((prev) =>
              prev.map((a) =>
                a.id === numericId
                  ? { ...a, status: "active" as const }
                  : a,
              ),
            );
          }
        });
        bulkSelection.clearSelection();
        addNotification({
          type: "success",
          title: `${selectedIds.length} ponto${selectedIds.length !== 1 ? "s" : ""} turístico${selectedIds.length !== 1 ? "s" : ""} publicado${selectedIds.length !== 1 ? "s" : ""}`,
          message:
            "Os pontos turísticos selecionados foram publicados com sucesso.",
        });
        break;

      case "unpublish":
        selectedIds.forEach((id) => {
          const numericId = parseInt(id);
          const attraction = attractions.find(
            (a) => a.id === numericId,
          );
          if (attraction && attraction.status === "active") {
            setAttractions((prev) =>
              prev.map((a) =>
                a.id === numericId
                  ? { ...a, status: "inactive" as const }
                  : a,
              ),
            );
          }
        });
        bulkSelection.clearSelection();
        addNotification({
          type: "success",
          title: `${selectedIds.length} ponto${selectedIds.length !== 1 ? "s" : ""} turístico${selectedIds.length !== 1 ? "s" : ""} ocultado${selectedIds.length !== 1 ? "s" : ""}`,
          message:
            "Os pontos turísticos selecionados foram ocultados com sucesso.",
        });
        break;
    }
  };

  const bulkActions: BulkAction[] = [
    {
      id: "publish",
      label: "Publicar",
      icon: Eye,
      variant: "outline",
    },
    {
      id: "unpublish",
      label: "Ocultar",
      icon: EyeOff,
      variant: "outline",
    },
    {
      id: "delete",
      label: "Excluir",
      icon: Trash2,
      variant: "destructive",
      requiresConfirmation: true,
      confirmationTitle:
        "Excluir pontos turísticos selecionados",
      confirmationDescription:
        "Esta ação não pode ser desfeita. Os pontos turísticos selecionados serão permanentemente removidos.",
    },
  ];

  if (attractions.length === 0) {
    return (
      <EmptyState
        title="Nenhum ponto turístico cadastrado"
        description="Comece criando o primeiro ponto turístico da cidade"
        icon="MapPin"
        actionLabel="Criar Ponto Turístico"
        onAction={handleCreateAttraction}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Gerenciamento de Pontos Turísticos
          </h1>
          <p className="text-muted-foreground">
            Organize e gerencie as atrações e locais de
            interesse da cidade de Timon
          </p>
        </div>
        <Button onClick={handleCreateAttraction}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Ponto Turístico
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Total
                </p>
                <p className="text-2xl font-bold">
                  {attractions.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Eye className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Ativos
                </p>
                <p className="text-2xl font-bold">
                  {
                    attractions.filter(
                      (a) => a.status === "active",
                    ).length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Edit className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Rascunhos
                </p>
                <p className="text-2xl font-bold">
                  {
                    attractions.filter(
                      (a) => a.status === "draft",
                    ).length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Star className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Avaliação
                </p>
                <p className="text-2xl font-bold">
                  {attractions.length > 0
                    ? (
                        attractions.reduce(
                          (acc, a) => acc + a.rating,
                          0,
                        ) / attractions.length
                      ).toFixed(1)
                    : "0.0"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista Principal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[16px]">
            <MapPin className="h-4 w-4" />
            Pontos Turísticos ({filteredAttractions.length})
          </CardTitle>
          <CardDescription>
            Lista de todas as atrações turísticas e locais de
            interesse da cidade
          </CardDescription>
          <div className="mt-4 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar pontos turísticos..."
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      Todas as categorias
                    </SelectItem>
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id}
                      >
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">
                      Ativo
                    </SelectItem>
                    <SelectItem value="inactive">
                      Inativo
                    </SelectItem>
                    <SelectItem value="draft">
                      Rascunho
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>

        {/* Componente de ações em lote */}
        <div className="px-6 pb-4">
          <BulkActions
            selectedIds={bulkSelection.selectedIds}
            totalItems={filteredAttractions.length}
            onSelectAll={bulkSelection.selectAll}
            onClearSelection={bulkSelection.clearSelection}
            actions={bulkActions}
            onAction={handleBulkAction}
            itemName="ponto turístico"
          />
        </div>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      bulkSelection.selectedIds.length ===
                        filteredAttractions.length &&
                      filteredAttractions.length > 0
                    }
                    onCheckedChange={(checked) => {
                      if (checked) {
                        bulkSelection.selectAll();
                      } else {
                        bulkSelection.clearSelection();
                      }
                    }}
                    aria-label="Selecionar todos"
                  />
                </TableHead>
                <TableHead>Ponto Turístico</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Avaliação</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Atualizado</TableHead>
                <TableHead className="text-left">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttractions.map((attraction) => {
                const categoryData = getCategoryData(
                  attraction.category,
                );
                const statusData = getStatusBadge(
                  attraction.status,
                );
                const IconComponent =
                  categoryData?.icon || MapPin;

                return (
                  <TableRow key={attraction.id}>
                    <TableCell>
                      <Checkbox
                        checked={bulkSelection.selectedIds.includes(
                          attraction.id,
                        )}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            bulkSelection.select(attraction.id);
                          } else {
                            bulkSelection.unselect(
                              attraction.id,
                            );
                          }
                        }}
                        aria-label={`Selecionar ${attraction.name}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <ImageWithFallback
                            src={attraction.image}
                            alt={attraction.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {attraction.name}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {attraction.shortDescription}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          categoryData?.color ||
                          "bg-gray-100 text-gray-800"
                        }
                      >
                        <IconComponent className="h-3 w-3 mr-1" />
                        {categoryData?.label || "Outros"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span className="line-clamp-1">
                          {attraction.address}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                        <span className="text-sm">
                          {attraction.rating.toFixed(1)}
                        </span>
                        <span className="text-xs text-muted-foreground ml-1">
                          ({attraction.reviews})
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusData.style}>
                        {statusData.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(
                        attraction.updatedAt,
                      ).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              handleEditAttraction(attraction)
                            }
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleDeleteAttraction(attraction)
                            }
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remover
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <Dialog
        open={isCreateModalOpen || isEditModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateModalOpen(false);
            setIsEditModalOpen(false);
            setCurrentAttraction(null);
          }
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditModalOpen
                ? "Editar Ponto Turístico"
                : "Novo Ponto Turístico"}
            </DialogTitle>
            <DialogDescription>
              {isEditModalOpen
                ? "Atualize as informações do ponto turístico"
                : "Preencha os detalhes do novo ponto turístico"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Nome do ponto turístico"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="shortDescription">
                  Descrição Curta *
                </Label>
                <Input
                  id="shortDescription"
                  value={formData.shortDescription || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      shortDescription: e.target.value,
                    }))
                  }
                  placeholder="Breve descrição"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="category">Categoria *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: value as any,
                    }))
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id}
                      >
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="address">Endereço *</Label>
                <Input
                  id="address"
                  value={formData.address || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  placeholder="Endereço completo"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  placeholder="(99) 9999-9999"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="hours">
                  Horário de Funcionamento *
                </Label>
                <Input
                  id="hours"
                  value={formData.hours || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      hours: e.target.value,
                    }))
                  }
                  placeholder="Ex: Segunda a sexta: 8h às 17h"
                  className="mt-2"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="image">URL da Imagem</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="image"
                    value={formData.image || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        image: e.target.value,
                      }))
                    }
                    placeholder="https://..."
                  />
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="entrance">
                  Tipo de Entrada
                </Label>
                <Select
                  value={formData.entrance || "gratuito"}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      entrance: value as any,
                    }))
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gratuito">
                      Gratuito
                    </SelectItem>
                    <SelectItem value="pago">Pago</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.entrance === "pago" && (
                <div>
                  <Label htmlFor="price">Preço</Label>
                  <Input
                    id="price"
                    value={formData.price || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                    placeholder="R$ 10,00"
                    className="mt-2"
                  />
                </div>
              )}

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="accessibility"
                    checked={formData.accessibility || false}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        accessibility: checked,
                      }))
                    }
                  />
                  <Label htmlFor="accessibility">
                    Acessível
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="parking"
                    checked={formData.parking || false}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        parking: checked,
                      }))
                    }
                  />
                  <Label htmlFor="parking">
                    Estacionamento
                  </Label>
                </div>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status || "draft"}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: value as any,
                    }))
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">
                      Rascunho
                    </SelectItem>
                    <SelectItem value="active">
                      Ativo
                    </SelectItem>
                    <SelectItem value="inactive">
                      Inativo
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="description">
              Descrição Completa *
            </Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Descrição detalhada do ponto turístico"
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateModalOpen(false);
                setIsEditModalOpen(false);
                setCurrentAttraction(null);
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleSaveAttraction}>
              {isEditModalOpen ? "Atualizar" : "Criar"} Ponto
              Turístico
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Confirmar Remoção
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover o ponto turístico "
              {attractionToDelete?.name}"? Esta ação não pode
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}