import Shaders from "../shaders/Shaders";
import MaterialContainer from "./MaterialContainer";
import {RendererTypes} from "~/lib/renderer/RendererTypes";
import ResourceManager from "../../world/ResourceManager";
import AbstractRenderer from "~/lib/renderer/abstract-renderer/AbstractRenderer";
import Config from "../../Config";

export default class RoadMaterialContainer extends MaterialContainer {
	public constructor(renderer: AbstractRenderer) {
		super(renderer);

		this.material = this.renderer.createMaterial({
			name: 'Road material',
			uniforms: [
				{
					name: 'modelViewMatrix',
					block: 'PerMesh',
					type: RendererTypes.UniformType.Matrix4,
					value: new Float32Array(16)
				}, {
					name: 'modelViewMatrixPrev',
					block: 'PerMesh',
					type: RendererTypes.UniformType.Matrix4,
					value: new Float32Array(16)
				}, {
					name: 'projectionMatrix',
					block: 'PerMaterial',
					type: RendererTypes.UniformType.Matrix4,
					value: new Float32Array(16)
				}, {
					name: 'time',
					block: 'PerMaterial',
					type: RendererTypes.UniformType.Float1,
					value: new Float32Array(1)
				}, {
					name: 'tMap',
					block: null,
					type: RendererTypes.UniformType.Texture2DArray,
					value: this.renderer.createTexture2DArray({
						width: 512,
						height: 512,
						depth: 8 * 3,
						anisotropy: 16,
						data: [
							ResourceManager.get('pavementDiffuse'),
							ResourceManager.get('pavementNormal'),
							ResourceManager.get('pavementMask'),

							ResourceManager.get('asphaltDiffuse'),
							ResourceManager.get('asphaltNormal'),
							ResourceManager.get('asphaltMask'),

							ResourceManager.get('cobblestoneDiffuse'),
							ResourceManager.get('cobblestoneNormal'),
							ResourceManager.get('cobblestoneMask'),

							ResourceManager.get('footballPitchDiffuse'),
							ResourceManager.get('emptyNormal'),
							ResourceManager.get('emptyMask'),

							ResourceManager.get('basketballPitchDiffuse'),
							ResourceManager.get('emptyNormal'),
							ResourceManager.get('emptyMask'),

							ResourceManager.get('tennisPitchDiffuse'),
							ResourceManager.get('emptyNormal'),
							ResourceManager.get('emptyMask'),

							ResourceManager.get('manicuredGrassDiffuse'),
							ResourceManager.get('emptyNormal'),
							ResourceManager.get('emptyMask'),

							ResourceManager.get('cyclewayDiffuse'),
							ResourceManager.get('emptyNormal'),
							ResourceManager.get('emptyMask'),
						],
						minFilter: RendererTypes.MinFilter.LinearMipmapLinear,
						magFilter: RendererTypes.MagFilter.Linear,
						wrap: RendererTypes.TextureWrap.Repeat,
						format: RendererTypes.TextureFormat.RGBA8Unorm,
						mipmaps: true
					})
				}, {
					name: 'tWaterNormal',
					block: null,
					type: RendererTypes.UniformType.Texture2D,
					value: this.renderer.createTexture2D({
						anisotropy: 16,
						data: ResourceManager.get('waterNormal'),
						minFilter: RendererTypes.MinFilter.LinearMipmapLinear,
						magFilter: RendererTypes.MagFilter.Linear,
						wrap: RendererTypes.TextureWrap.Repeat,
						format: RendererTypes.TextureFormat.RGBA8Unorm,
						mipmaps: true
					})
				}, {
					name: 'tRingHeight',
					block: null,
					type: RendererTypes.UniformType.Texture2DArray,
					value: null
				}, {
					name: 'tNormal',
					block: null,
					type: RendererTypes.UniformType.Texture2DArray,
					value: null
				}, {
					name: 'transformNormal0',
					block: 'PerMesh',
					type: RendererTypes.UniformType.Float4,
					value: new Float32Array(4)
				}, {
					name: 'transformNormal1',
					block: 'PerMesh',
					type: RendererTypes.UniformType.Float4,
					value: new Float32Array(4)
				}, {
					name: 'terrainRingSize',
					block: 'PerMesh',
					type: RendererTypes.UniformType.Float1,
					value: new Float32Array(1)
				}, {
					name: 'terrainRingOffset',
					block: 'PerMesh',
					type: RendererTypes.UniformType.Float4,
					value: new Float32Array(4)
				}, {
					name: 'terrainLevelId',
					block: 'PerMesh',
					type: RendererTypes.UniformType.Int1,
					value: new Int32Array(1)
				}, {
					name: 'segmentCount',
					block: 'PerMesh',
					type: RendererTypes.UniformType.Float1,
					value: new Float32Array(1)
				}, {
					name: 'cameraPosition',
					block: 'PerMesh',
					type: RendererTypes.UniformType.Float2,
					value: new Float32Array(2)
				}
			],
			defines: {
				TILE_SIZE: Config.TileSize.toFixed(10),
				NORMAL_MIX_FROM: Config.TerrainNormalMixRange[0].toFixed(1),
				NORMAL_MIX_TO: Config.TerrainNormalMixRange[1].toFixed(1)
			},
			primitive: {
				frontFace: RendererTypes.FrontFace.CCW,
				cullMode: RendererTypes.CullMode.Back
			},
			depth: {
				depthWrite: false,
				depthCompare: RendererTypes.DepthCompare.LessEqual,
				depthBiasConstant: -2,
				depthBiasSlopeScale: -1
			},
			blend: {
				color: {
					operation: RendererTypes.BlendOperation.Add,
					srcFactor: RendererTypes.BlendFactor.One,
					dstFactor: RendererTypes.BlendFactor.Zero
				},
				alpha: {
					operation: RendererTypes.BlendOperation.Add,
					srcFactor: RendererTypes.BlendFactor.One,
					dstFactor: RendererTypes.BlendFactor.Zero
				}
			},
			vertexShaderSource: Shaders.road.vertex,
			fragmentShaderSource: Shaders.road.fragment
		});
	}
}
