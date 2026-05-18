import { Draggable } from '@hello-pangea/dnd';

export const MealSlot = ({ day, slot, meal, index, onRemove }) => {
    if (!meal) {
        return (
            <div className="bg-gray-50 rounded-lg p-3 min-h-[100px] flex items-center justify-center border-2 border-dashed border-gray-300">
                <span className="text-gray-400 text-sm">Drop recipe here</span>
            </div>
        );
    }

    return (
        <Draggable draggableId={`${day}-${slot}-${meal.id}`} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-3 shadow-sm ${snapshot.isDragging ? 'shadow-lg ring-2 ring-green-500' : ''
                        }`}
                >
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <h4 className="font-medium text-gray-800 text-sm">{meal.title}</h4>
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                                <span>⏱️ {meal.prepTime} min</span>
                                <span>👥 {meal.servings} servings</span>
                            </div>
                        </div>
                        {onRemove && (
                            <button
                                onClick={() => onRemove()}
                                className="text-red-500 hover:text-red-700 text-lg leading-none"
                            >
                                ×
                            </button>
                        )}
                    </div>
                </div>
            )}
        </Draggable>
    );
};